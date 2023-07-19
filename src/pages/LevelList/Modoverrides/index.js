import {Box, Card, Container} from "@mui/material";
import {Button, Spin, Skeleton, Space} from "antd";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {ArrowLeftOutlined} from '@ant-design/icons';
import Editor from "../../Home/Editor";
import {getLevelModoverridesApi, saveLevelLeveldataoverrideApi, saveLevelModoverridesApi} from "../../../api/levelApi";

export default () => {

    const {cluster, levelName, levelType} = useParams()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [spinLoading, setSpinLoading] = useState(false)
    const [modoverrides, setModoverrides] = useState(`return {}`)

    useEffect(() => {
        setLoading(true)
        getLevelModoverridesApi(cluster, levelName)
            .then(resp => {
                if (resp.code === 200) {
                    setModoverrides(resp.data)
                }
                setLoading(false)
            })
    }, [])

    function saveModoverrides() {
        setSpinLoading(true)
        saveLevelModoverridesApi(cluster, {
            levelName,
            modoverrides
        }).then(resp => {
            if (resp.code === 200) {
                setModoverrides(resp.data)
            }
            setSpinLoading(false)
        })
    }

    return <>
        <Container maxWidth="xl">
            <Spin spinning={spinLoading} description={"正在保存 modoverrides "}>
                <Card>
                    <Box sx={{p: 2}} dir="ltr">
                        <Space size={32} wrap>
                            <Button type={"link"} icon={<ArrowLeftOutlined/>}
                                    onClick={() => navigate(`/dashboard/level`)}>返回</Button>
                            <Button type={"primary"}
                                    onClick={() => saveModoverrides()}>{loading ? '正在加载配置' : '保存配置'}</Button>
                        </Space>
                    </Box>
                </Card>
                <br/>
                <Card>
                    <Box sx={{p: 3}} dir="ltr">
                        <div style={{
                            paddingBottom: '12px',
                        }}>
                            <span style={{
                                fontSize: '16px',
                                fontWeight: '600',
                            }}>
                            {`${levelName}世界 modoverrides.lua 配置`}
                        </span>
                        </div>
                        <Skeleton loading={loading} active>
                            <Editor value={modoverrides}
                                    setValue={setModoverrides}
                                    styleData={{language: "lua", theme: "vs-dark"}}
                            />
                        </Skeleton>
                    </Box>
                </Card>
            </Spin>
        </Container>
    </>
}