# Instalación PictUp!
Para instalo, primero es necesario descargar <a href="https://www.npmjs.com/" target="_blanck">Node.js</a>

A continuación desde la consola de comandos, acceder a la carpeta "CUADRICULA" que incluye el packaje.json, src, publica, etc. Una vez en dicha carpeta: 

## Intalar la aplicación:
```
npm install
```

## Ejecución

Para lanzar PictUp! de manera local:
```
npm start
```
Acesible desde: http://localhost:3000/.

# Despliegue de PictUp! en servidor

## Crear versión optimizada para desplegar
Creará una carpeta build con todos los elementos necesarios para desplegar la aplicación. Antes de ello, es recomendable modificar packaje.json para ajustar los valores de homepage en función del dominio donde se despliegue, entre otras opciones.
```
npm build
```

## Ajuste del servidor
Dentro del contenedor donde se aloja la aplicación, es necesario instalar previamente <a href="https://github.com/nodesource/distributions" target="_blanck">Node.js</a>

# Ubuntu
```
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```
# Debian
```
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt-get install -y nodejs
```

Para el despliegue, se utilizó el comando <a href="https://create-react-app.dev/docs/deployment/#static-server" target="_blanck">serve</a>. https://create-react-app.dev/docs/deployment/#static-server

# Instalación de serve
```
npm install -g serve
```

Una vez subida la carpeta build al contenedor, ejecutar el comando serve para que aparezca la web en la url asignada: 
```
sudo serve -s ./build -p 80 -n
```

## Resources
PictUp! ha sido posible gracias a [Accessible Drag-and-Drop](https://github.com/salesforce-ux/dnd-a11y-patterns) para la creación del tablero cuadriculado. 
