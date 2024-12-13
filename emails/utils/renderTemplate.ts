import ejs from 'ejs';
import path from 'path';

export const renderTemplate = async (templateName: string, templateData: object) => {
  console.log('rendertemplate data: ', templateData);
  const templatePath = path.join(process.cwd(), 'emails', 'templates', `${templateName}.ejs`);
  try {
    const renderedTemplate = await ejs.renderFile(templatePath, templateData);
    console.log('Rendered Template:', renderedTemplate); // Log for debugging
    return renderedTemplate;
  } catch (error) {
    console.error('Error rendering template:', error); // Log the error
    throw error;
  }
};
