FROM  python:3.10.12

WORKDIR /backend

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED=1

# install system dependencies
RUN apt-get update && apt-get install -y netcat-traditional

COPY req.txt ./

RUN pip install  -r req.txt

COPY manage.py ./

# copy entrypoint.sh
COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /backend/entrypoint.sh
RUN chmod +x /backend/entrypoint.sh

COPY . .

#EXPOSE 8000

# run entrypoint.sh
ENTRYPOINT ["/backend/entrypoint.sh"]

