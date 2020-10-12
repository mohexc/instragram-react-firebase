import { message, Modal } from 'antd'
import React, { useImperativeHandle, useState } from 'react'
import { Form, Input, Button, } from 'antd';
import { storage, db, timestamp } from '../configs/firebase';
import './CreatePost.less'
import getBase64 from '../utils/getBase64'


const CreatePost = ({ user }, ref) => {
    const [visible, setVisible] = useState(false)
    const [submitButton, setSubmitButton] = useState(false)
    const [file, setFile] = useState(null)
    const [previewImage, setPreviewImage] = useState()
    const [error, setError] = useState(null)

    const [progress, setProgress] = useState()
    useImperativeHandle(ref, () => {
        return {
            showModal: (data) => {
                setVisible(true)

            }
        }
    })


    const onFinish = (values) => {
        setSubmitButton(true)
        if (file) {
            const storageRef = storage.ref(file.name)
            storageRef.put(file).on(
                "state_changed",
                (snap) => {
                    let percenttage = (snap.bytesTransferred / snap.totalBytes) * 100
                    setProgress(percenttage)
                },
                (err) => {
                    message.error(err.message)
                    setSubmitButton(false)
                },
                () => {
                    storageRef.getDownloadURL().then((url) => {
                        db.collection("posts")
                            .add({
                                timestamp: timestamp(),
                                caption: values.caption,
                                username: user.displayName ? user.displayName : user.email,
                                imageUrl: url
                            })
                            .then(res => {
                                console.log(res)
                                setSubmitButton(false)
                                setVisible(false)
                                setPreviewImage()
                                setFile()
                            })
                            .catch(e => message.error(e.message))

                    })
                })
            return
        }
        if (values.caption && !file) {
            db.collection("posts")
                .add({
                    timestamp: timestamp(),
                    caption: values.caption,
                    username: user.displayName ? user.displayName : user.email,
                    imageUrl: null
                })
                .then(res => {
                    console.log(res)
                    setSubmitButton(false)
                    setVisible(false)
                    setPreviewImage()
                    setFile()
                })
                .catch(e => message.error(e.message))
            return
        }


    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleFile = (e) => {
        console.log(e.target.files[0])
        const types = ['image/png', 'image/jpeg']
        const selectedFile = e.target.files[0]
        if (selectedFile && types.includes(selectedFile.type)) {
            setFile(selectedFile)
            getBase64(selectedFile)
                .then(data => setPreviewImage(data))
                .catch(e => console.log(e))
            setError('')
        } else {
            setFile(null)
            setError('Please select an image file (png or jpeg) 💥')
        }

    }

    return (
        <Modal
            onCancel={() => setVisible(false)}
            title={<h3 style={{ textAlign: "center" }}><span>Create Post</span></h3>}
            visible={visible}
            footer={null}
            destroyOnClose={true}

        >
            <Form
                // {...formItemLayout}
                colon={true}
                name="Create Post"
                initialValues={{ remember: true, }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item name="caption" rules={[{ required: true, message: 'Please input your Caption!', },]}>
                    <Input.TextArea placeholder={`What's on your mind, ${user && user.displayName}`} rows={7} />
                </Form.Item>
                {previewImage && <img src={previewImage} alt="previewImage" height="100px" />}
                {error && <div style={{ color: "red" }}>{error}</div>}
                {file && <div>{file.name}</div>}
                <label className="label-input-image">
                    <span style={{ display: "flex", justifyContent: "center", alignItems: "center", height: '100%' }}>
                        <input type="file" onChange={handleFile}></input>
                        <span>upload</span>
                    </span>
                </label>


                <Form.Item >
                    <Button shape="round" loading={submitButton} disabled={submitButton} type="primary" htmlType="submit">Post</Button>
                    <Button shape="round" style={{ marginLeft: "1rem" }} onClick={() => setVisible(false)}>Cancle</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default React.forwardRef(CreatePost)
