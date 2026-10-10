FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY news.html /usr/share/nginx/html/news.html
COPY assets /usr/share/nginx/html/assets
EXPOSE 80
