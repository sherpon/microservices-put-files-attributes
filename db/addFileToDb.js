
const addFileToDb = async (firestore, websiteId, type, filename, timestamp, url, title) => {
  const websiteRef = firestore.collection('websites').doc(websiteId);
  switch (type) {
    case 'template':
      return websiteRef.collection('files').add({
        type: type,
        filename: filename,
        createdAt: timestamp,
      });

    case 'page':
      return websiteRef.collection('files').add({
        type: type,
        filename: filename,
        createdAt: timestamp,
        url,
        keywords:'',
        title,
        description:'',
        meta:'',
        scripts:'',
        styles:'',
      });
  
    default:
      return;
  }
};

module.exports = addFileToDb;