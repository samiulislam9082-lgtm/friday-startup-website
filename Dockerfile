FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY news.html /usr/share/nginx/html/news.html
COPY 404.html /usr/share/nginx/html/404.html
COPY privacy.html /usr/share/nginx/html/privacy.html
COPY terms.html /usr/share/nginx/html/terms.html
COPY ai-innovation/index.html /usr/share/nginx/html/ai-innovation/index.html
COPY business-automation/index.html /usr/share/nginx/html/business-automation/index.html
COPY business-recovery/index.html /usr/share/nginx/html/business-recovery/index.html
COPY growth-partnerships/index.html /usr/share/nginx/html/growth-partnerships/index.html
COPY venture-building/index.html /usr/share/nginx/html/venture-building/index.html
COPY help/index.html /usr/share/nginx/html/help/index.html
COPY assets/ /usr/share/nginx/html/assets/
COPY robots.txt /usr/share/nginx/html/robots.txt
COPY sitemap.xml /usr/share/nginx/html/sitemap.xml
COPY service-sitemap.txt /usr/share/nginx/html/service-sitemap.txt
COPY llms.txt /usr/share/nginx/html/llms.txt
COPY google1c3e0b7a53014830.html /usr/share/nginx/html/google1c3e0b7a53014830.html
EXPOSE 80
