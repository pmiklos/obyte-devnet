FROM	node:8.7

COPY	. /root/

WORKDIR	/root

RUN	npm install

RUN	npm run init

RUN	echo | npm run genesis

RUN	echo | npm run blackbytes

EXPOSE	6611 6612

CMD	[ "/bin/sh", "-c", "echo | npm run witness" ]

