import {ProColumns, ProFormInstance} from '@ant-design/pro-components';
import {ModalForm, ProForm, ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-components';
import '@umijs/max';
import {Form} from 'antd';
import React, {useEffect, useRef} from 'react';

export type Props = {
  values:API.InterfaceInfo;
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onFinish: (values: API.InterfaceInfo) => Promise<void>;
  visible: boolean;
};

const UpdateModal: React.FC<Props> = (props) => {
  const [form] = Form.useForm<{ name: string; company: string }>();
  const {visible, values,columns, onCancel, onFinish} = props;
  const formRef=useRef<ProFormInstance>();
  useEffect(()=>{
    if (formRef){
      formRef.current?.setFieldsValue(values);
    }
  },[values])
  return (
    <ModalForm
      autoFocusFirstInput
      visible={visible}
      form={form}
      formRef={formRef}
      modalProps={{
        destroyOnClose: true,
        onCancel: () =>onCancel?.(),
      }}
      onFinish={async (values) => {
        onFinish?.(values);
      }}>

      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="接口名称"
          initialValue={values.name}
          tooltip="最长为 24 位"
          placeholder="请输入接口名称"
        />

        <ProFormText
          width="md"
          name="description"
          initialValue={values.description}
          label="接口描述"
          placeholder="请输入接口描述"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="url"
          initialValue={values.url}
          label="接口地址"
          placeholder="请输入接口地址"
        />

        <ProFormSelect
          width="md"
          name="method"
          initialValue={values.method}
          label="请求类型"
          options={[
            {
              value:'GET',
              label:'GET',
            },
            {
              value:'POST',
              label:'POST',
            }
          ]
          }
          placeholder="请输入请求类型"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width="md"
          name="requestParams"
          initialValue={values.requestParams}
          tooltip="请以JSON格式输入"
          label="请求参数"
          placeholder="请输入请求参数"
        />

        <ProFormTextArea
          width="md"
          name="requestHeader"
          initialValue={values.requestHeader}
          label="请求头"
          tooltip="请以JSON格式输入"
          placeholder="请输入请求头"
        />

        <ProFormTextArea
          width="md"
          name="responseHeader"
          initialValue={values.responseHeader}
          label="响应头"
          tooltip="请以JSON格式输入"
          placeholder="请输入响应头"
        />
      </ProForm.Group>
    </ModalForm>
  );
};
export default UpdateModal;
