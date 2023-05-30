import CreateModal from '@/pages/Admin/InterfaceInfo/components/CreateModal';
import UpdateModal from '@/pages/Admin/InterfaceInfo/components/UpdateModal';
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingGET,
  offlineInterfaceInfoUsingPOST,
  publishInterfaceInfoUsingPOST,
  updateInterfaceInfoUsingPOST,
} from '@/services/bobochangAPI/interfaceInfoController';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react';

const InterfaceInfo: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const actionRef = useRef<ActionType>();
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      await addInterfaceInfoUsingPOST({
        ...fields,
      });
      hide();
      message.success('创建成功');
      handleModalVisible(false);
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('创建失败，' + error.message);
      return false;
    }
  };

  const handleUpdate = async (fields: API.InterfaceInfo) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    try {
      await updateInterfaceInfoUsingPOST({
        id: currentRow.id,
        ...fields,
      });
      hide();
      message.success('操作成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  const handleRemove = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteInterfaceInfoUsingPOST({
        id: record.id,
      });
      hide();
      message.success('删除成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  const handleOnline = async (record: API.IdRequest) => {
    const hide = message.loading('发布中');
    if (!record) return true;
    try {
      await publishInterfaceInfoUsingPOST({
        id: record.id,
      });
      hide();
      message.success('操作成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  const handleOffline = async (record: API.IdRequest) => {
    const hide = message.loading('发布中');
    if (!record) return true;
    try {
      await offlineInterfaceInfoUsingPOST({
        id: record.id,
      });
      hide();
      message.success('操作成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: '接口名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: 'url',
      dataIndex: 'url',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '请求参数',
      dataIndex: 'requestParams',
      valueType: 'jsonCode',
      hideInSearch: true,
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
      hideInSearch: true,
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Error',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        record.status === 0 ? (
          <a
            key="0"
            type="text"
            style={{ color: 'green' }}
            onClick={() => {
              handleOnline(record);
            }}
          >
            发布
          </a>
        ) : null,
        record.status === 1 ? (
          <a
            type="text"
            style={{ color: 'orange' }}
            key="1"
            onClick={() => {
              handleOffline(record);
            }}
          >
            下线
          </a>
        ) : null,
        <a
          key="2"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <a
          key="3"
          style={{ color: 'red' }}
          onClick={() => {
            handleRemove(record).then((res) => {
              console.log(res);
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer style={{ whiteSpace: 'pre-wrap' }}>
      <ProTable<API.RuleListItem, API.PageParams>
        actionRef={actionRef}
        cardBordered
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="button"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (
          params,
          sort: Record<string, SortOrder>,
          filter: Record<string, React.ReactText[] | null>,
        ) => {
          const res: any = await listInterfaceInfoByPageUsingGET({
            ...params,
          });
          if (res?.data) {
            return {
              data: res?.data.records || [],
              success: true,
              total: res?.data.total || 0,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
      />
      <CreateModal
        values={columns}
        visible={createModalVisible}
        onCancel={() => {
          handleModalVisible(false);
        }}
        onFinish={(values): Promise<boolean> => handleAdd(values)}
      />
      <UpdateModal
        columns={columns}
        values={currentRow || {}}
        onCancel={() => {
          handleUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        onFinish={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        visible={updateModalVisible}
      />
    </PageContainer>
  );
};
export default InterfaceInfo;
