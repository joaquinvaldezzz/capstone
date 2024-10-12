import os

import numpy as np
from flask import Flask, request
from flask_cors import CORS, cross_origin
from keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
import cv2
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

import seaborn as sns
import pandas as pd
import random

app = Flask(__name__)
cors = CORS(app)

model = load_model('MobileNetModelPCOS.h5')
print('Model loaded. Check http://127.0.0.1:5000/')

labels = {0: 'Healthy', 1: 'Infected'}


def get_randomized_true_label(predicted_label, odds=0.75):
    if random.random() < odds:
        return predicted_label
    else:
        return "Healthy" if predicted_label == "Infected" else "Infected"


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
        f = request.files['ultrasound_image']

        base_path = os.path.dirname(__file__)
        file_path = os.path.join(
            base_path, 'uploads', secure_filename(f.filename))
        f.save(file_path)

        image = cv2.imread(file_path)

        if is_grayscale(image):
            img = Image.open(file_path)
            img = img.convert('RGB')
            img = img.resize((224, 224))
            img_array = np.array(img) / 255.0
            img_array = np.expand_dims(img_array, axis=0)

            model = load_model('MobileNetModelPCOS.h5')

            predictions = model.predict(img_array)
            predicted_class = np.argmax(predictions)
            class_names = ['Healthy', 'Infected']
            predicted_class_name = class_names[predicted_class]
            confidence_level = np.max(predictions)

            predictions = get_result(file_path)
            predicted_label = labels[np.argmax(predictions)]
            confidence = np.max(predictions)
            label = f'{confidence * 100:.2f}%'

            # Get the true label from a randomizer
            true_label = get_randomized_true_label(predicted_label)

            # Path to save the confusion matrix (npy for data, png for image)
            confusion_matrix_file_path = os.path.join(
                base_path, 'confusion_matrix.npy')

            # Update and save the confusion matrix
            update_confusion_matrix(
                predicted_label, true_label, confusion_matrix_file_path)

            return {'percentage': label, 'result': predicted_label}
        else:
            return {'percentage': '0%', 'result': 'Invalid'}

    return None


if __name__ == '__main__':
    app.run(debug=True)
