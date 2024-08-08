import { deleteObject, getStorage, ref } from "@firebase/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDocsFromCache,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Event } from "../types/EventType";
import { Fundraising } from "../types/FundraisingType";
import { User } from "../types/UserType";

let chapters: { [key: string]: string[] } = {};

export const getChapters = async () => {
  await getChapterData();

  const chapterNames: string[] = [];
  Object.keys(chapters).forEach((region) => {
    chapterNames.push(...chapters[region]);
  });
  return chapterNames;
};

export const getRegions = async () => {
  await getChapterData();

  return Object.keys(chapters);
};

export const getChapterRegionData = async () => {
  await getChapterData();

  return chapters;
};

export function getChapterData(): Promise<any[]> {
  const collectionRef = collection(db, "chapters");
  return new Promise((resolve, reject) => {
    getDocsFromCache(collectionRef)
      .then((snapshot: any) => {
        const allDocuments: any[] = [];
        const chapterRegions: { [key: string]: string[] } = {};
        chapterRegions["National"] = ["National"];
        snapshot.docs.map((doc: any) => {
          const document = doc.data();
          const newChapter = { ...document, id: doc.id };
          if (!chapterRegions[document.region]) {
            chapterRegions[document.region] = [document.name];
          } else {
            chapterRegions[document.region].push(document.name);
          }
          allDocuments.push(newChapter);
        });
        if (allDocuments.length == 0) {
          getDocs(collectionRef)
            .then((snapshot: any) => {
              const otherDocuments: any = [];
              snapshot.docs.map((doc: any) => {
                const document = doc.data();
                const newChapter = { ...document, id: doc.id };
                if (!chapterRegions[document.region]) {
                  chapterRegions[document.region] = [document.name];
                } else {
                  chapterRegions[document.region].push(document.name);
                }
                otherDocuments.push(newChapter);
              });
              chapters = { ...chapterRegions };
              resolve(otherDocuments);
            })
            .catch((error: any) => {
              reject(error);
            });
        } else {
          chapters = { ...chapterRegions };
          resolve(allDocuments);
        }
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function getDashboardData() {}

export function getEventsData(): Promise<{ event: Event; id: string }[]> {
  const collectionRef = collection(db, "events");
  return new Promise((resolve, reject) => {
    getDocs(collectionRef)
      .then((snapshot: any) => {
        const allDocuments: { event: Event; id: string }[] = [];
        const documents = snapshot.docs.map((doc: any) => {
          const document = doc.data();
          const newEvent = { event: document, id: doc.id };
          allDocuments.push(newEvent);
        });
        resolve(allDocuments);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function getFundraisingData(): Promise<
  { fundraising: Fundraising; id: string }[]
> {
  const collectionRef = collection(db, "fundraisers");
  return new Promise((resolve, reject) => {
    getDocs(collectionRef)
      .then((snapshot: any) => {
        const allDocuments: { fundraising: Fundraising; id: string }[] = [];
        const documents = snapshot.docs.map((doc: any) => {
          const document = doc.data();
          const newFundraiser = { fundraising: document, id: doc.id };
          allDocuments.push(newFundraiser);
        });
        resolve(allDocuments);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function getUsersData(): Promise<{ user: User; id: string }[]> {
  const collectionRef = collection(db, "users");
  return new Promise((resolve, reject) => {
    getDocs(collectionRef)
      .then((snapshot: any) => {
        const allDocuments: { user: User; id: string }[] = [];
        const documents = snapshot.docs.map((doc: any) => {
          const document = doc.data();
          const newUser = { user: document, id: doc.id };
          allDocuments.push(newUser);
        });
        resolve(allDocuments);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function getUserById(id: string): Promise<any[]> {
  const collectionRef = query(
    collection(db, "users"),
    /* Toss in conditions here*/
    where("auth_id", "==", id)
  );
  return new Promise((resolve, reject) => {
    getDocs(collectionRef)
      .then((snapshot: any) => {
        const allDocuments: any = [];
        const documents = snapshot.docs.map((doc: any) => {
          const document = doc.data();
          const newUser = { ...document, id: doc.id };
          allDocuments.push(newUser);
        });
        resolve(allDocuments);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function updateUser(user: Partial<User>, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === "" || !id) {
      reject(new Error("Invalid id"));
      return;
    }
    const collectionRef = doc(db, "users", id);
    updateDoc(collectionRef, { name: user.name, chapterName: user.chapterName })
      .then(() => {
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}
export function addEvent(event: Event): Promise<string> {
  return new Promise((resolve, reject) => {
    addDoc(collection(db, "events"), event)
      .then((docRef: any) => {
        // return id of document added
        resolve(docRef.id);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function updateEvent(event: Partial<Event>, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === "" || !id) {
      reject(new Error("Invalid id"));
      return;
    }
    const collectionRef = doc(db, "events", id);
    updateDoc(collectionRef, { ...event })
      .then(() => {
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function deleteEvent(fileRef: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    deleteDoc(doc(db, "events", id))
      .then(async () => {
        if (fileRef) {
          const storage = getStorage();
          const pathReference = ref(storage, fileRef);
          await deleteObject(pathReference).catch((error) => {});
        }
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function addFundraiser(fundraiser: any): Promise<string> {
  return new Promise((resolve, reject) => {
    addDoc(collection(db, "fundraisers"), fundraiser)
      .then((docRef: any) => {
        // return id of document added
        resolve(docRef.id);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function updateFundraiser(
  fundraiser: Partial<Fundraising>,
  id: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === "" || !id) {
      reject(new Error("Invalid id"));
      return;
    }
    const collectionRef = doc(db, "fundraisers", id);
    updateDoc(collectionRef, { ...fundraiser })
      .then(() => {
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function deleteFundraiser(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    deleteDoc(doc(db, "fundraisers", id))
      .then(() => {
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}
