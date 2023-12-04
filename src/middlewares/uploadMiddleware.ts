// dans un fichier middleware, par exemple, uploadMiddleware.js
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

export default upload;
