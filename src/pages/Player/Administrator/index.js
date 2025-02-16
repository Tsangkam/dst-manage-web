/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {Row, Col, Button, Divider, Space, Image, Tag, Modal, Popconfirm} from 'antd';
import {useState} from "react";
import { dstRoles } from '../../../utils/dst';
import AddModel from "../AddModel";


const find = (playerList, kuId) => playerList.filter(item => item.kuId === kuId)[0]

function updateAdminKuId(kuId) {

}

const showAdmin = (playerList, kuId) => {
    if (find(playerList, kuId)) {
        return <>
            <div>
                <Image preview={false} width={48} src={dstRoles[find(playerList, kuId).role]} />
            </div>
            <div>
            <Tag color="green">在线</Tag>
            <span>{find(playerList, kuId).name}</span>
            </div>
        </>
    }
    return <></>

}

const Administrator = ({ adminPlayerList, playerList,addAdminlist, deleteAdminlist }) => {

    const [isModalOpen, setIsModalOpen] = useState(false)

    // eslint-disable-next-line react/prop-types
    const list = adminPlayerList.map((kuId) => (
        <>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Space size={'middle'}>
                    {showAdmin(playerList, kuId) }
                    <span style={{ color: '#1677ff' }}>{kuId}</span>
                </Space>

            </Col>
            <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                <Space style={{ float: 'right' }}>
                    <Popconfirm
                        title="是否删除管理员"
                        onConfirm={()=>{deleteAdminlist(kuId)}}
                        onCancel={()=>{}}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger >删除</Button>
                    </Popconfirm>
                </Space>
            </Col>
            <Divider style={{ margin: '0px' }} />
        </>
    ))

    return (
        <>
            <AddModel title={"添加管理员"} setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} add={addAdminlist} />
            <Row align="middle" gutter={[8, 20]} style={{ rowGap: '12px' }}>
                {list}
            </Row>
        </>
    )
}

export default Administrator