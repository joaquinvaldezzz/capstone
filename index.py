import os

import numpy as np
from flask import Flask, request
from flask_cors import CORS, cross_origin
from keras.models import load_model  # type: ignore
from tensorflow.keras.preprocessing.image import load_img, img_to_array  # type: ignore
from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
import cv2
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

app = Flask(__name__)
cors = CORS(app)

model = load_model('MobileNetModelPCOS.h5')
print('Model loaded. Check http://127.0.0.1:5000/')

labels = {0: 'Healthy', 1: 'Infected'}


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

            return {'percentage': label, 'result': predicted_label}
        else:
            return {'percentage': '0%', 'result': 'Invalid photo'}

    return None


if __name__ == '__main__':
    app.run(debug=True)
