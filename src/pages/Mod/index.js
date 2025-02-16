import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import _ from 'lodash'
import luaparse from 'luaparse';
import { parse } from "lua-json";

import {Skeleton, Tabs} from 'antd';
import ModList from './ModList';
import ModSearch from './ModSearch';
import {getMyModInfoList} from '../../api/modApi';

function unstring(str) {
    if (typeof str === 'string') {
        return str.replace(/^"(.*)"$/, '$1')
    }
    return str
}

function getWorkShopConfigMap2(modoverride) {
    try {
        const result = parse(modoverride);
        const keys = Object.keys(result)
        console.log("keys",keys.length)
        const workshopMap = new Map();
        keys.forEach(workshopId => {
            workshopMap.set(workshopId.replace('workshop-', '').replace('"', '').replace('"', ''), result[workshopId].configuration_options)
        })
        console.log("lua-json =-==-----", workshopMap)
        return workshopMap
    } catch (error) {
        return new Map()
    }

}

function getWorkShopConfigMap(modConfig) {

    if (modConfig === undefined || modConfig === null) {
        return new Map()
    }
    try {
        const ast = luaparse.parse(modConfig)
        const workshopListAst = ast.body[0].arguments[0].fields
        console.log("+++++++++", workshopListAst)
        const workshopMap = new Map();
        const workshopMap2 = {}
        // eslint-disable-next-line no-restricted-syntax
        for (const workshopAst of workshopListAst) {
            try {
                const {key} = workshopAst
                const {value} = workshopAst
                const workshopId = key.raw.replace("\n", "")
                const config = {}

                workshopMap.set(workshopId.replace('workshop-', '').replace('"', '').replace('"', ''), config)
                workshopMap2[`${workshopId.replace('workshop-', '').replace('"', '').replace('"', '')}`] = config
                // eslint-disable-next-line no-restricted-syntax
                for (const field of value.fields) {
                    if (field.key.name === 'configuration_options') {
                        // eslint-disable-next-line no-restricted-syntax
                        for (const configItem of field.value.fields) {
                            if (configItem.key !== undefined && configItem.key.raw === undefined) {
                                // 饥荒本地生成的配置
                                if(configItem.key.name !== undefined) {
                                    const name = unstring(configItem.key.name)
                                    if (configItem.value.value === undefined) {
                                        if (configItem.value.argument !== undefined && configItem.value.operator === "-") {
                                            config[name] = -(configItem.value.argument.value)
                                        } else {
                                            config[name] = configItem.value.value
                                        }
                                    } else if (configItem.value.value === null) {
                                        config[name] = unstring(configItem.value.raw)
                                    } else {
                                        config[name] = configItem.value.value
                                    }
                                }
                                // 判断是否是table
                                // eslint-disable-next-line no-lonely-if
                                if (configItem.type !== undefined && configItem.type === "TableKeyString") {
                                    if (configItem.value.type !== undefined &&
                                        configItem.value.type === "TableConstructorExpression") {
                                        const values = []
                                        // eslint-disable-next-line no-restricted-syntax
                                        for(const field of configItem.value.fields) {
                                            values.push(unstring(field.value.raw))
                                        }
                                        config[unstring(configItem.key.name)] = values
                                    }
                                }
                            } else {
                                const name = unstring(configItem.key.raw)
                                if (configItem.value.value === undefined) {
                                    if (configItem.value.argument !== undefined && configItem.value.operator === "-") {
                                        config[name] = -(configItem.value.argument.value)
                                    } else {
                                        config[name] = configItem.value.value
                                    }
                                } else if (configItem.value.value === null) {
                                    config[name] = unstring(configItem.value.raw)
                                } else {
                                    config[name] = configItem.value.value
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.log('workshop error', error);
            }

        }
        console.log("workshopMap: ",workshopMap)
        return workshopMap
    } catch (error) {
        console.log('workshopMap error', error);
        return new Map()
    }
}


function initModList(subscribeModList, modoverrides, setDefaultValuesMap, setModList, setRoot) {
    const object = {}
    const workshopMap = getWorkShopConfigMap2(modoverrides)
    console.log("subscribeModList: ", subscribeModList)
    let subscribeModMap = new Map()
    if (subscribeModList === undefined || subscribeModList === null) {
        subscribeModList = []
    }

    subscribeModList.forEach(mod => {
        const {modid} = mod
        const options = mod.mod_config.configuration_options
        if (options !== undefined && options !== null) {
            options.forEach(item => {
                if (item.default !== '') {
                    _.set(object, `${modid}.${item.name}`, item.default)
                }
            })
        }
        if (workshopMap.has(modid)) {
            mod.enable = true
            mod.installed = true
        } else {
            mod.enable = false
            mod.installed = true
            workshopMap.set(modid, object[modid])
        }
    });

    subscribeModMap = subscribeModList.reduce((acc, item) => {
        acc.set(item.modid, item);
        return acc;
    }, new Map());


    console.log("subscribeModMap: ", subscribeModMap)

    // 如果没有订阅mod
    workshopMap.forEach((value, key) => {
        if (subscribeModMap.get(key) === undefined) {
            console.log("not subscribe mod: ", key)
            subscribeModList.push({
                modid: key,
                installed: false
            })
        }
    });

    setDefaultValuesMap(workshopMap)
    setModList(subscribeModList || [])
    setRoot(object)

}

const Mod = ({modoverrides}) => {

    const [modList, setModList] = useState([])
    const [root, setRoot] = useState({})

    const [defaultValuesMap, setDefaultValuesMap] = useState(getWorkShopConfigMap2(modoverrides))
    const {cluster} = useParams()
    const [loading, setLoading] =useState(false)
    useEffect(() => {
        setLoading(true)
        getMyModInfoList(cluster)
            .then(resp => {
                initModList(resp.data, modoverrides, setDefaultValuesMap, setModList, setRoot)
                setLoading(false)
            }).catch(error => console.log(error))
    }, [])

    useEffect(() => {
        console.log('root', root);

    }, [root])

    const items = [
        {
            key: '1',
            label: `配置模组`,
            children: <ModList
                modList={modList}
                setModList={setModList}
                root={root}
                setRoot={setRoot}
                defaultValuesMap={defaultValuesMap}
                setDefaultValuesMap={setDefaultValuesMap}
            />,
        },
        {
            key: '2',
            label: `订阅模组`,
            children: <ModSearch addModList={setModList}/>,
        },
    ];


    return <Skeleton loading={loading} >
        <Tabs defaultActiveKey="1" items={items}/>
    </Skeleton>
}

export default Mod