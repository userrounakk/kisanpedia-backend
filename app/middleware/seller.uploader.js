const multer = require("multer");
const fs = require("fs");

const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let basePath = "public/uploads";
    let path;
    if (file.fieldname === "products") {
      path = `${basePath}/products`;
    } else if (file.fieldname === "image") {
      path = `${basePath}/sellers`;
    } else {
      path = basePath;
    }

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  filename: (req, file, cb) => {
    file.originalname = file.originalname.split(" ").join("-");
    let name = file.originalname.split(".");
    let filename = name[0] + "-" + Date.now() + "." + name[name.length - 1];
    cb(null, filename);
  },
});

const imageFilter = (req, file, cb) => {
  let ext = file.originalname.split(".").pop();
  let allowed_extension = ["jpg", "jpeg", "png", "webp", "bmp", "svg", "avif"];
  if (allowed_extension.includes(ext.toLowerCase())) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const sellerUploader = multer({
  storage: myStorage,
  fileFilter: imageFilter,
});

module.exports = sellerUploader;
