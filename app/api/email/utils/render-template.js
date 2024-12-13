import ejs from "ejs";
import path from "path";

export const renderTemplate = async (templateName, data) => {
  const templatePath = path.join(
    process.cwd(),
    `emails/templates/${templateName}.ejs`
  );

  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, data, (err, str) => {
      if (err) {
        reject(err);
      } else {
        resolve(str);
      }
    });
  });
};
