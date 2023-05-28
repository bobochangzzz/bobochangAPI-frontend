import type {ProColumns} from '@ant-design/pro-components';
import {ModalForm, ProForm, ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-components';
import '@umijs/max';
import {Form} from 'antd';
import React from 'react';

export type Props = {
  values: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onFinish: (values: API.InterfaceInfo) => Promise<boolean>;
  visible: boolean;
};

const CreateModal: React.FC<Props> = (props) => {
  const [form] = Form.useForm<{ name: string; company: string }>();
  const {visible, values, onCancel, onFinish} = props;

  return (
    /*<Modal visible={visible} footer={null} style={{border: 20}} onCancel={() => onCancel?.()}>
      <ProTable
        type="form"
        columns={columns}
        onSubmit={async (value) => {
          onSubmit?.(value);
        }}
      />
    </Modal>*/
    <ModalForm
      autoFocusFirstInput
      visible={visible}
      form={form}
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
          tooltip="最长为 24 位"
          placeholder="请输入接口名称"
        />

        <ProFormText
          width="md"
          name="description"
          label="接口描述"
          placeholder="请输入接口描述"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="url"
          label="接口地址"
          placeholder="请输入接口地址"
        />

        <ProFormSelect
          width="md"
          name="method"
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
          tooltip="请以JSON格式输入"
          label="请求参数"
          placeholder="请输入请求参数"
        />

        <ProFormTextArea
          width="md"
          name="requestHeader"
          label="请求头"
          tooltip="请以JSON格式输入"
          placeholder="请输入请求头"
        />

        <ProFormTextArea
          width="md"
          name="responseHeader"
          label="响应头"
          tooltip="请以JSON格式输入"
          placeholder="请输入响应头"
        />
      </ProForm.Group>
    </ModalForm>
    /*<ModalForm<{
      name: string;
      company: string;
    }>
      title="新建表单"
      trigger={
        <Button type="primary">
          <PlusOutlined/>
          新建表单
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        console.log(values.name);
        message.success('提交成功');
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="签约客户名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
        />

        <ProFormText
          width="md"
          name="company"
          label="我方公司名称"
          placeholder="请输入名称"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="contract"
          label="合同名称"
          placeholder="请输入名称"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          request={async () => [
            {
              value: 'chapter',
              label: '盖章后生效',
            },
          ]}
          width="xs"
          name="useMode"
          label="合同约定生效方式"
        />
        <ProFormSelect
          width="xs"
          options={[
            {
              value: 'time',
              label: '履行完终止',
            },
          ]}
          name="unusedMode"
          label="合同约定失效效方式"
        />
      </ProForm.Group>
      <ProFormText width="sm" name="id" label="主合同编号"/>
      <ProFormText
        name="project"
        disabled
        label="项目名称"
        initialValue="xxxx项目"
      />
      <ProFormText
        width="xs"
        name="mangerName"
        disabled
        label="商务经理"
        initialValue="启途"
      />
    </ModalForm>*/
  );
};
export default CreateModal;
