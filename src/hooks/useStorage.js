import { storage, db, timestamp } from '../configs/firebase'
import { useState, useEffect } from 'react'

const useStorage = (file) => {
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)
    const [url, setUrl] = useState(null)
    useEffect(() => {
        const storageRef = storage.ref(file.name)
        const collectionRef = db.collection("images")

        storageRef.put(file).on(
            "state_changed",
            (snap) => {
                let percenttage = (snap.bytesTransferred / snap.totalBytes) * 100
                setProgress(percenttage)
            },
            (err) => {
                setError(err)
            },
            async () => {
                const url = await storageRef.getDownloadURL()
                const createdAt = timestamp()
                await collectionRef.add({ url, createdAt })
                setUrl(url)
            }
        )
    }, [file])
    return { progress, url, error }
}

export default useStorage
