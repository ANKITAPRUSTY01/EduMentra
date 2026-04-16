import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
import joblib
import os

# 1. Create Mock Dataset
data = {
    'reason': [
        "I have a high fever and headache.",
        "Going to attend my sister's wedding.",
        "Family emergency, need to travel.",
        "Suffering from stomach ache.",
        "Personal work at bank.",
        "Not feeling well, dizzy.",
        "Going for a vacation with family.",
        "Grandmother is sick, need to visit.",
        "Caught a cold and cough.",
        "Attending a funeral.",
        "Just want to sleep.",
        "Bored of classes.",
        "Going to watch a movie.",
        "Overslept.",
        "Playing video games.",
        "Food poisoning.",
        "Chicken pox.",
        "Doctor appointment.",
        "Visa interview.",
        "Passport renewal.",
        "Feeling lazy today.",
        "Going out with friends.",
        "Shopping for clothes.",
        "Don't want to attend lecture.",
        "Have a party to attend.",
        "Playing cricket match.",
        "Too tired to come.",
        "Woke up late.",
        "Traffic jam.",
        "Rainy weather.",
        "Severe migraine.",
        "Dental appointment.",
        "Eye checkup.",
        "Brother's engagement.",
        "Religious ceremony.",
        "Medical checkup.",
        "Friend's birthday.",
        "Movie release today.",
        "Gaming tournament.",
        "Just taking a break.",
        "hi",
        "hello",
        "hey",
        "test",
        "testing",
        "...",
        "ok",
        "please",
        "sir",
        "madam",
        "leave",
        "want leave",
        "give me leave",
        "i want to go",
        "bye",
        "blah blah",
        "asdf",
        "qwerty",
        "Diagnosed with typhoid.",
        "Recovering from malaria.",
        "Tested positive for dengue.",
        "Undergoing surgery tomorrow.",
        "Fractured my leg.",
        "Severe food poisoning, hospitalized.",
        "Attending a technical hackathon.",
        "Selected for a workshop.",
        "Paper presentation at conference.",
        "Internship interview at Google.",
        "Sister's marriage ceremony.",
        "Grandfather passed away.",
        "Uncle is critical in ICU.",
        "Mother is sick, need to take care.",
        "Urgent bank work for education loan.",
        "Passport verification appointment.",
        "Aadhar card update appointment.",
        "Blood donation camp.",
        "NSS camp duty.",
        "Representing college in sports.",
        "Severe back pain.",
        "Wisdom tooth extraction.",
        "Eye infection.",
        "High fever and chills.",
        "Bukhar hai",
        "Tabiyat kharab hai",
        "Sir dard kar raha hai",
        "Pet dard hai",
        "Ghar jana hai",
        "Didi ki shadi hai",
        "Papa ki tabiyat kharab hai",
        "Hospital jana hai",
        "Fever hai",
        "Sick leave chahiye",
        "Not feeling well aaj",
        "Kal nahi aapaunga",
        "Urgent kaam hai ghar pe"
    ],
    'label': [
        "genuine", "genuine", "genuine", "genuine", "genuine",
        "genuine", "non-genuine", "genuine", "genuine", "genuine",
        "non-genuine", "non-genuine", "non-genuine", "non-genuine", "non-genuine",
        "genuine", "genuine", "genuine", "genuine", "genuine",
        "non-genuine", "non-genuine", "non-genuine", "non-genuine", "non-genuine",
        "non-genuine", "non-genuine", "non-genuine", "non-genuine", "non-genuine",
        "genuine", "genuine", "genuine", "genuine", "genuine",
        "genuine", "non-genuine", "non-genuine", "non-genuine", "non-genuine",
        "non-genuine", "non-genuine", "non-genuine", "non-genuine", "non-genuine",
        "non-genuine", "non-genuine", "non-genuine", "non-genuine", "non-genuine",
        "non-genuine", "non-genuine", "non-genuine", "non-genuine", "non-genuine",
        "non-genuine", "non-genuine", "non-genuine",
        "genuine", "genuine", "genuine", "genuine", "genuine",
        "genuine", "genuine", "genuine", "genuine", "genuine",
        "genuine", "genuine", "genuine", "genuine", "genuine",
        "genuine", "genuine", "genuine", "genuine", "genuine",
        "genuine", "genuine", "genuine", "genuine", "genuine",
        "genuine", "genuine", "genuine", "genuine", "genuine",
        "genuine", "genuine", "genuine", "genuine", "genuine",
        "genuine", "genuine"
    ]
}

df = pd.DataFrame(data)

# 2. Text Preprocessing & Feature Extraction
vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(df['reason'])
y = df['label']

# 3. Train Model
model = LogisticRegression(class_weight='balanced')
model.fit(X, y)

# 4. Save Model and Vectorizer
os.makedirs("backend", exist_ok=True)
joblib.dump(model, "backend/leave_classification_model.pkl")
joblib.dump(vectorizer, "backend/tfidf_vectorizer.pkl")

print("Model trained and saved to backend/")

# Test
test_sentence = ["I have a fever"]
test_vec = vectorizer.transform(test_sentence)
print(f"Test Prediction for '{test_sentence[0]}': {model.predict(test_vec)[0]}")
