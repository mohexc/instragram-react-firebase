import { Modal } from 'antd'
import React, { useImperativeHandle, useState } from 'react'
import { Form, Input, Button, message } from 'antd';
import { auth } from '../configs/firebase';


const formItemLayout = {
    labelCol: {
        xs: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 18 }
    },
}
const tailLayout = {
    wrapperCol: {
        xs: {

            span: 24
        },
        sm: {
            offset: 6,
            span: 18,
        }
    },
};
// main
const SignUp = (props, ref) => {
    const [visible, setVisible] = useState(false)
    const [submitButton, setSubmitButton] = useState(false)

    useImperativeHandle(ref, () => {
        return {
            showModal: () => {
                setVisible(true)
            }
        }
    })

    const onFinish = async (values) => {
        setSubmitButton(true)
        const result = await auth.createUserWithEmailAndPassword(values.email, values.password)
            .then(async (authUser) => {
                const result = await authUser.user.updateProfile({ displayName: values.username })
                    .then(res => res)
                    .catch(e => message.error(e.message))
                setSubmitButton(false)
                setVisible(false)
                return result
            })
            .catch(e => {
                message.error(e.message)
                setSubmitButton(false)
            })
        debugger
        return result
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Modal
            onCancel={() => setVisible(false)}
            title="SignUp"
            visible={visible}
            footer={null}
            destroyOnClose={true}

        >
            <Form
                {...formItemLayout}
                colon={true}
                name="signUp"
                initialValues={{ remember: true, }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your password!', },]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Email" name="email" rules={[
                    { required: true, message: 'Please input your username!' },
                    { type: 'email', message: 'The input is not valid E-mail!' },
                ]} >
                    <Input />
                </Form.Item>

                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!', },]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button
                        loading={submitButton}
                        disabled={submitButton}
                        type="primary"
                        htmlType="submit">
                        SignUp
                    </Button>
                    <Button style={{ marginLeft: "1rem" }} onClick={() => setVisible(false)}>Cancle</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default React.forwardRef(SignUp)
