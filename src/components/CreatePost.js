import { message, Modal, Row } from 'antd'
import React, { useImperativeHandle, useState } from 'react'
import { Form, Input, Button, } from 'antd';
import { auth } from '../configs/firebase';
import './CreatePost.less'
import getBase64 from '../utils/getBase64'


const CreatePost = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [submitButton, setSubmitButton] = useState(false)
    const [file, setFile] = useState(null)
    const [previewImage, setPreviewImage] = useState()
    const [error, setError] = useState(null)
    const [user, setUser] = useState()

    useImperativeHandle(ref, () => {
        return {
            showModal: (data) => {
                setVisible(true)
                setUser(data)
            }
        }
    })

    const onFinish = async (values) => {
        setSubmitButton(true)
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
                <Form.Item name="caption" rules={[{ required: true, message: 'Please input your password!', },]}>
                    <Input.TextArea placeholder={`What's on your mind, ${user && user.displayName}`} rows={7} />
                </Form.Item>
                {previewImage && <img src={previewImage} alt="previewImage" height="100px" />}
                {error && <div style={{ color: "red" }}>{error}</div>}
                {file && <div>{file.name}</div>}
                <label>
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
