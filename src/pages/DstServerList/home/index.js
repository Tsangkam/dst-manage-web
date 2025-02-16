import {useEffect, useState} from "react";

import { Tabs } from 'antd';

import Players from '../component/Players';
import HomeOverView from '../component/HomeOverView';
import HomeModInfo from '../component/HomeModInfo';

import {getMyModInfoList} from "../../../api/modApi";
import Secondaries from "./Secondaries";

const HomeDetail = (props) => {

    const players = props.home.successinfo.players || []
    const home = props.home.successinfo || {
        data: {
            day: '未知'
        }
    }
    const mods = props.home.successinfo.mods_info || []
    const secondaries = props.home.successinfo.secondaries || []
    const [subscribedModList, setSubscribedModList] = useState([])
    useEffect(()=>{
        getMyModInfoList()
            .then(resp=>{
                if (resp.code === 200) {
                    setSubscribedModList(resp.data)
                }
            })
    }, [])

    const items = [
        {
            label: '概要',
            key: '1',
            children: (<div>{<HomeOverView home={home}/>}</div>)
        },
        {
            label: '玩家',
            key: '2',
            children: (<div>{<Players players={players} />}</div>)
        },
        {
            label: '模组',
            key: '3',
            children: (<div>
                {<HomeModInfo
                    mods={mods}
                    subscribedModList={subscribedModList}
                    setSubscribedModList={setSubscribedModList}
                />}
            </div>)
        },
        {
            label: '从世界',
            key: '4',
            children: <Secondaries secondaries={secondaries} />
        },

    ]

    return (
        <>
            <Tabs
                defaultActiveKey="1"
                centered
                items={items}
            />
        </>
    )
}

export default HomeDetail