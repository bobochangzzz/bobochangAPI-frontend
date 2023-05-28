import React, {useEffect, useState} from "react";
import {getInterfaceInfoByIdUsingGET, invokeInterfaceUsingPOST} from "@/services/bobochangAPI/interfaceInfoController";
import {Button, Card, Descriptions, Form, Input, message} from "antd";
import {useParams} from "@@/exports";
import {PageContainer} from "@ant-design/pro-components";

const InterfaceInfo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [invokeLoading, setInvokeLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const placeholder = '示例：{"username": "bobochang"}';

  const params = useParams();
  const onFinish = async (values: any) => {
    setInvokeLoading(true)
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    try {
      const res = await invokeInterfaceUsingPOST({
        id: params.id,
        ...values,
      });
      setInvokeRes(res.data);
      message.success('调用成功')
    } catch (error: any) {
      message.error('调用失败 ' + error.message)
    }
    setInvokeLoading(false)
  };
  const loadData = async () => {
    setLoading(true);
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    try {
      const res = await getInterfaceInfoByIdUsingGET({
        id: Number(params.id)
      });
      setData(res?.data);
    } catch (e: any) {
      message.error('获取接口信息失败 ' + e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [])
  return (
    <PageContainer>
      <Card loading={loading} title="接口信息">
        {data ? (
          <Descriptions column={2}>
            <Descriptions.Item label="接口名称">{data?.name}</Descriptions.Item>
            <Descriptions.Item label="接口描述">{data?.description}</Descriptions.Item>
            <Descriptions.Item label="接口状态">{data?.status ? '开启' : '关闭'}</Descriptions.Item>
            <Descriptions.Item label="接口方法">{data?.method}</Descriptions.Item>
            <Descriptions.Item label="接口地址">{data?.url}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data?.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">&nbsp;&nbsp;&nbsp;{data?.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">&nbsp;&nbsp;&nbsp;{data?.responseHeader}</Descriptions.Item>
          </Descriptions>
        ) : <>接口信息不存在</>
        }
      </Card>
      <Card title="请求参数" style={{marginTop: 18}}>
        <Form
          name="invoke"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="requestParams"
          >
            <Input.TextArea placeholder={placeholder}/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={invokeLoading}>
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="调用结果" style={{marginTop: 18}} loading={invokeLoading}>
        {invokeRes ? invokeRes : "点击调用后会显示调用结果"}
      </Card>
    </PageContainer>
  )
}
export default InterfaceInfo
