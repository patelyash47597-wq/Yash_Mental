FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=5000
EXPOSE 5000

# Ensure NLTK data and TextBlob corpora are available at build time so runtime
# workers don't attempt network downloads and fail under restricted environments.
ENV NLTK_DATA=/usr/local/share/nltk_data
RUN mkdir -p ${NLTK_DATA} && \
	python -c "import nltk; nltk.download('punkt', download_dir='${NLTK_DATA}'); nltk.download('averaged_perceptron_tagger', download_dir='${NLTK_DATA}'); nltk.download('wordnet', download_dir='${NLTK_DATA}')"

# Use the PORT environment variable provided by Render (or defaults to 5000)
# Use shell form so $PORT is expanded at container start time.
CMD ["sh", "-c", "gunicorn -w 4 -b 0.0.0.0:$PORT wsgi:app"]
