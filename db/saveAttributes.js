
const saveAttributes = (
    firestore, 
    websiteId, 
    type, 
    filename, 
    url, 
    title,
    keywords,
    description,
    themeColor,
    meta,
    script,
    style
  ) => {
    const websiteRef = firestore.collection('websites').doc(websiteId);
    switch (type) {
      //case 'template':
      //  return websiteRef.collection('files').doc(id).update({
      //    filename: filename,
      //  });
  
      case 'page':
        return websiteRef.collection('files').doc(filename).update({
          url,
          title,
          keywords,
          description,
          themeColor,
          meta,
          script,
          style,
        });
    
      default:
        return;
    }
  };

module.exports = saveAttributes;