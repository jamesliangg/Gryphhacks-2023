import pickle

import cv2
import mediapipe as mp
import numpy as np
import time

from gtts import gTTS
from pydub import AudioSegment
from pydub.playback import play
import os

string = ''
count = 0

model_dict = pickle.load(open('./model.p', 'rb'))
model = model_dict['model']

cap = cv2.VideoCapture(0)

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)

labels_dict = {0: 'G', 1: 'U', 2: 'E', 3: 'L', 4: 'P', 5: 'H'}
while True:

    data_aux = []
    x_ = []
    y_ = []

    ret, frame = cap.read()

    H, W, _ = frame.shape

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = hands.process(frame_rgb)
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(
                frame,  # image to draw
                hand_landmarks,  # model output
                mp_hands.HAND_CONNECTIONS,  # hand connections
                mp_drawing_styles.get_default_hand_landmarks_style(),
                mp_drawing_styles.get_default_hand_connections_style())

        for hand_landmarks in results.multi_hand_landmarks:
            for i in range(len(hand_landmarks.landmark)):
                x = hand_landmarks.landmark[i].x
                y = hand_landmarks.landmark[i].y

                data_aux.append(x)
                data_aux.append(y)

                x_.append(x)
                y_.append(y)

        x1 = int(min(x_) * W) 
        y1 = int(min(y_) * H) 

        x2 = int(max(x_) * W) 
        y2 = int(max(y_) * H) 

        prediction = model.predict([np.asarray(data_aux)])

        predicted_character = labels_dict[int(prediction[0])]
        print(predicted_character)

        if len(string) == 0 or string[-1] != predicted_character:
            count+=1
            if count == 15:
                count = 0
                print("True")
                string += predicted_character

        print("total string: ", string)

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 0), 4)
        cv2.putText(frame, predicted_character, (x1, y1 ), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 3,
                    cv2.LINE_AA)

    cv2.imshow('frame', frame)
    if cv2.waitKey(1) == ord('q'):
        break


cap.release()
cv2.destroyAllWindows()


# Function to convert text to audio and play it
def text_to_speech(text):
    # Create a gTTS object and specify the language
    tts = gTTS(text=text, lang='en')

    # Save the speech as an audio file in memory
    audio_file = "temp_audio.mp3"
    tts.save(audio_file)

    # Load the audio file
    audio = AudioSegment.from_mp3(audio_file)

    # Play the audio
    play(audio)

    # Clean up - remove the temporary audio file
    os.remove(audio_file)

text_to_speech(string)


