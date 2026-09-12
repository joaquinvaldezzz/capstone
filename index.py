import os

import cv2
import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from PIL import Image
from flask import Flask, request
from flask_cors import CORS, cross_origin
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from werkzeug.utils import secure_filename

app = Flask(__name__)
cors = CORS(app)

model = load_model('MobileNetModelPCOS.h5')
last_conv_layer = model.get_layer('out_relu')
grad_model = tf.keras.models.Model(
    inputs=model.inputs,
    outputs=[last_conv_layer.output, model.output if not isinstance(model.output, list) else model.output[0]],
)
print('Model loaded. Check http://127.0.0.1:5000/')

labels = {0: 'Healthy', 1: 'Infected'}


def load_confusion_matrix(file_path):
    if os.path.exists(file_path):
        return np.load(file_path)  # Load the existing matrix
    else:
        return np.zeros((2, 2))  # Initialize a new confusion matrix


def save_confusion_matrix(matrix, file_path):
    np.save(file_path, matrix)  # Save the matrix to a .npy file

    # Plot the confusion matrix and save it as an image
    fig, ax = plt.subplots()
    cax = ax.matshow(matrix, cmap='Blues', alpha=0.7)

    # Add color bar for better visualization
    fig.colorbar(cax)

    # Define class names for axes
    class_names = ['Healthy', 'Infected']

    # Label axes with the class names
    ax.set_xticks([0, 1])
    ax.set_yticks([0, 1])
    ax.set_xticklabels(class_names)
    ax.set_yticklabels(class_names)

    # Move x-axis tick labels to the bottom
    ax.xaxis.set_ticks_position('bottom')
    ax.xaxis.set_label_position('bottom')

    # Annotate the cells with the confusion matrix values
    for (i, j), val in np.ndenumerate(matrix):
        ax.text(j, i, f'{int(val)}', ha='center', va='center')

    # Set axis labels
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title("Confusion Matrix")

    # Save the confusion matrix image as well
    image_file_path = file_path.replace('.npy', '.png')
    plt.savefig(image_file_path)
    plt.close()


def update_confusion_matrix(predicted_label, true_label, matrix_file_path):
    # Load the existing confusion matrix (or create a new one if it doesn't exist)
    matrix = load_confusion_matrix(matrix_file_path)

    # Update confusion matrix based on the predicted and true labels
    if predicted_label == 'Healthy' and true_label == 'Healthy':
        matrix[0, 0] += 1
    elif predicted_label == 'Healthy' and true_label == 'Infected':
        matrix[0, 1] += 1
    elif predicted_label == 'Infected' and true_label == 'Healthy':
        matrix[1, 0] += 1
    elif predicted_label == 'Infected' and true_label == 'Infected':
        matrix[1, 1] += 1

    # Save the updated confusion matrix back to the file
    save_confusion_matrix(matrix, matrix_file_path)


def is_grayscale(image, threshold=10):
    image = image.astype(np.float32)

    diff_rg = np.abs(image[:, :, 0] - image[:, :, 1])
    diff_gb = np.abs(image[:, :, 1] - image[:, :, 2])
    diff_br = np.abs(image[:, :, 2] - image[:, :, 0])

    grayscale_mask = (diff_rg < threshold) & (
        diff_gb < threshold) & (diff_br < threshold)

    grayscale_percentage = np.sum(
        grayscale_mask) / (image.shape[0] * image.shape[1])

    return grayscale_percentage > 0.5


def get_result(image_path):
    image = load_img(image_path, target_size=(224, 224))
    image = image.convert('RGB')
    image = image.resize((224, 224))
    x = img_to_array(image)
    x = x.astype('float32') / 255.
    x = np.expand_dims(x, axis=0)
    predictions = model.predict(x)[0]
    return predictions


@app.route('/', methods=['GET'])
@cross_origin()
def index():
    return {'message': 'Welcome to the API'}


@app.route('/api/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        if 'ultrasound_image' not in request.files:
            return {'error': 'No file provided'}, 400
        f = request.files['ultrasound_image']

        if not f or not f.filename:
            return {'error': 'No file provided'}, 400

        base_path = os.path.dirname(__file__)
        uploads_dir = os.path.join(base_path, 'uploads')
        os.makedirs(uploads_dir, exist_ok=True)
        file_path = os.path.join(uploads_dir, secure_filename(f.filename))
        f.save(file_path)

        try:
            image = cv2.imread(file_path)

            if is_grayscale(image):
                with Image.open(file_path) as img:
                    img = img.convert('RGB')
                    img = img.resize((224, 224))
                    img_array = np.array(img) / 255.0
                    img_array = np.expand_dims(img_array, axis=0)

                predictions = model.predict(img_array)
                predicted_class = np.argmax(predictions)
                predicted_label = labels[predicted_class]
                confidence = np.max(predictions)
                label = f'{confidence * 100:.2f}%'

                # Grad-CAM integration
                with tf.GradientTape() as tape:
                    last_conv_layer_output, preds = grad_model(img_array)
                    top_pred_index = tf.argmax(preds[0])
                    top_class_channel = preds[:, top_pred_index]

                grads = tape.gradient(top_class_channel, last_conv_layer_output)
                pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
                last_conv_layer_output = last_conv_layer_output[0]
                heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
                heatmap = tf.squeeze(heatmap)
                heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
                heatmap = tf.expand_dims(heatmap, -1)
                heatmap = tf.image.resize(heatmap, (224, 224))
                heatmap = tf.squeeze(heatmap)
                heatmap = np.uint8(255 * heatmap.numpy())
                jet = plt.get_cmap('jet')
                heatmap_jet = jet(heatmap)[:, :, :3]
                superimposed_img = heatmap_jet * 0.4 + img_array[0]
                superimposed_img = np.clip(superimposed_img, 0, 1)

                # Save the superimposed image
                plt.imsave(file_path, superimposed_img)

                return {'percentage': label, 'result': predicted_label}
            else:
                return {'percentage': '0%', 'result': 'Invalid'}
        finally:
            if os.path.exists(file_path):
                os.remove(file_path)

    return None


if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_DEBUG', 'False').lower() == 'true')
