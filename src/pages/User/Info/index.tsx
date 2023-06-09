import { uploadFileUsingPOST } from '@/services/bobochangAPI/fileController';
import {
  getLoginUserUsingGET,
  reloadKeyUsingGET,
  updateMyUserUsingPOST,
} from '@/services/bobochangAPI/userController';
import { DownloadOutlined, LoadingOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Card, Col, Descriptions, Form, message, Row, Typography, Upload } from 'antd';
import Input from 'antd/es/input/Input';
import type { RcFile } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const Info: React.FC = () => {
  const { Paragraph } = Typography;
  const [imageUrl, setImageUrl] = useState<string>();
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<API.LoginUserVO>();
  const [updateKey, setUpdateKey] = useState<boolean>(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const loadData = async () => {
    try {
      const res = await getLoginUserUsingGET();
      console.log(res.data);
      if (res.data) {
        setUserData(res.data);
      }
    } catch (e: any) {
      message.error('获取用户信息失败 ' + e.message);
    }
  };

  const handleDownload = async () => {
    const fileUrl =
      'https://bobocahng-1309945187.cos.ap-guangzhou.myqcloud.com/bobochangAPI-sdk-1.0.jar'; // 替换为你要下载的文件的URL

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'bobochangAPI_SDK_1.0.jar'; // 可以设置下载文件的名称
    link.click();
  };
  const uploadImg = async (values: any) => {
    const res = await uploadFileUsingPOST(
      values.name,
      {
        biz: 'user_avatar',
      },
      values.file,
    );
    console.log(res.data);
    setAvatarUrl(res.data);
    getBase64(values.file as RcFile, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
  };

  const resetUpload = () => {
    setAvatarUrl(''); // 重置上传组件中显示的图片链接
    setImageUrl(''); // 重置预览的图片链接
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

  const reloadKeys = async () => {
    setUpdateKey(true);
    try {
      const res = await reloadKeyUsingGET();
      if (res.data) {
        message.success('重新生成密钥成功');
      }
    } catch (e: any) {
      message.error('重新生成密钥失败 ' + e.message);
    }
    setUpdateKey(false);
  };

  const onFinish = async (values: any) => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    const body = {
      userAvatar: avatarUrl,
      userName: values.userName,
    };
    try {
      const res = await updateMyUserUsingPOST(body);
      if (!res?.data) {
        message.error('修改失败');
      } else {
        message.success('修改成功');
        const updateUserData = await getLoginUserUsingGET();
        if (updateUserData.data) {
          // 更新全局状态中的用户信息
          setUserData(updateUserData.data);
        }
        // 更新全局状态中的用户信息
        setInitialState((prevState: any) => ({
          ...prevState,
          currentUser: {
            ...prevState.currentUser,
            ...updateUserData.data,
          },
        }));
        //location.reload();
      }
    } catch (e: any) {
      message.error('修改失败 ' + e.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    loadData();
  }, [updateKey]);

  return (
    <>
      <Card title="个人设置" style={{ whiteSpace: 'pre-wrap' }}>
        <Form name="userSetting" labelAlign="left" onFinish={onFinish}>
          <Form.Item name="userName" label="用户昵称">
            <Input></Input>
          </Form.Item>
          <Form.Item name="userAvatar" label="用户头像">
            <Upload
              name="avatarUrl"
              maxCount={1}
              listType="picture-card"
              className="avatar-uploader"
              customRequest={uploadImg}
              showUploadList={false}
              beforeUpload={beforeUpload}
              fileList={[]}
              // onChange={handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Row
              style={{
                marginLeft: -12,
                marginRight: -12,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Col style={{ paddingLeft: 12, paddingRight: 12 }}>
                <Button htmlType="reset" onClick={resetUpload}>
                  重置
                </Button>
              </Col>
              <Col style={{ paddingLeft: 12, paddingRight: 12 }}>
                <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                  修改
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
      <Card title="调用密钥" style={{ marginTop: 18 }}>
        <Descriptions column={1} style={{ justifyContent: 'flex-start' }}>
          <Descriptions.Item label="AccessKey">
            <Paragraph copyable>{userData?.accessKey}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="SecretKey">
            <Paragraph copyable>&nbsp;{userData?.secretKey}</Paragraph>
          </Descriptions.Item>
          <Row>
            <Col style={{ paddingLeft: 0, paddingRight: 12 }}>
              <Button type="default" icon={<DownloadOutlined />} onClick={handleDownload}>
                下载 SDK
              </Button>
            </Col>
            <Col style={{ paddingLeft: 12, paddingRight: 12 }}>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => {
                  reloadKeys();
                }}
              >
                重新生成
              </Button>
            </Col>
          </Row>
        </Descriptions>
      </Card>
    </>
  );
};

export default Info;
