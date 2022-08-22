import React, { useState } from "react";
import { db } from "../../firebase";
const useFireStoreGroup = (collection, condition) => {
  const [documents, setDocument] = useState([]);

  React.useEffect(() => {
    let collectionRef = db.collection(collection).orderBy("createAt");
    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        return;
      }

      collectionRef.where(
        condition.fileName,
        condition.operator,
        condition.compareValue
      );
    }
    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDocument(documents);
    });
    return unsubscribe;
  }, [collection, condition]);
  return documents;
};
export default useFireStoreGroup;
