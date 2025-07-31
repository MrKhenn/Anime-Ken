*🎬 Proyecto Web de Películas - Descripción General*

✨ Funcionalidades Principales
🧭 Navegación de Contenido

Página de Inicio: Incluye un carrusel dinámico con películas populares y una cuadrícula destacada con selecciones recomendadas.

Películas y Series: Secciones dedicadas para explorar títulos por categoría (películas o series).

Página de Géneros: Permite filtrar contenido por género. Se solucionó un bug que impedía la carga del contenido inicial.

Búsqueda: Una barra de búsqueda ubicada en la cabecera permite encontrar películas y series por nombre.

🔐 Sistema de Autenticación
Registro e Inicio de Sesión: Los usuarios pueden registrarse e iniciar sesión. Los datos se almacenan en users.json en el backend.

Sesión Persistente: La sesión se mantiene activa mediante almacenamiento en el navegador. La cabecera cambia mostrando el nombre del usuario y un botón para cerrar sesión.

💬 Interacción del Usuario
Likes y Dislikes: Usuarios autenticados pueden marcar si les gusta o no una película.

Comentarios: Usuarios autenticados pueden dejar comentarios en la página de detalles de una película.

Persistencia de Interacciones: Likes, dislikes y comentarios se almacenan en interactions.json en el backend.

🎥 Visualización de Películas
Página de Detalles: Muestra información detallada (año, género, director, actores, sinopsis, etc).

Reproductor de Video (Streamtape): Se integró la infraestructura para mostrar películas a través de Streamtape. Es necesario configurar una API Key válida en el backend para habilitar esta función.

🛠️ Tecnologías Utilizadas
Frontend:

React + TypeScript

Tailwind CSS

Backend:

Node.js + Express

APIs Externas:

TMDb (The Movie Database)

OMDb (Open Movie Database)

Streamtape (para reproducción de video)

🛠️ ¿Como Ejecutarlo?:

para ejecutarlo descargamos el .zip del repositorio y lo extraemos luego lo importamos a nuestro editor de codigo
importamos tanto el front como el backend que viene dentro de la carpeta raiz del proyecto, una vez importado descargamos las dependencias tanto del 
backend como del front y iniciamos los dos con el comando npm start, *recuerda para que funcione debe iniciar el servidor backend* 
