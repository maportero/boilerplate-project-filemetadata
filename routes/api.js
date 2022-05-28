

const fileAnalyse = (file, done ) => {
  console.log(file);
  const result = {
    name: file.originalname,
    type: file.mimetype,
    size: file.size
  }
  done(null, result);
}

exports.FileAnalyse = fileAnalyse; 