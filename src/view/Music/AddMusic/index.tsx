import * as React from 'react';

import { getMusicList, addMusic } from 'src/api/Music'

import { Modal, Form, Input, Spin } from 'antd';
import client from 'src/config/oss-config'
import { MusicContext } from '../index'

const AddMusic: React.FC = () => {
  const musicContext:any = React.useContext(MusicContext)
  
  const [ confirmLoading, setConfirmLoading ] = React.useState(false)
  const [ musicName, setMusicName ] = React.useState('')
  const [ singerName, setSingerName ] = React.useState('')
  const [ resultUrl, setResultUrl ] = React.useState('')
  const [ resultName, setResultName ] = React.useState('')
  const [ resultPicUrl, setResultPicUrl ] = React.useState('')
  const [ musicLoading, setMusicLoading ] = React.useState(false)

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  }

  let handleOk = () => {
    setConfirmLoading(true)
    addMusic(musicName, resultUrl, singerName, '', resultName, resultPicUrl).then((res) => {
      getMusicList().then((res) => {
        musicContext.dispatch({ type: 'getMusicList', payload: res})
      })
      musicContext.dispatch({ type: 'closeAdd'})
      setConfirmLoading(false)
    }).catch((err) => {
      console.log(err, '上传音乐错误')
      musicContext.dispatch({ type: 'closeAdd'})
      setConfirmLoading(false)
    })
  }

  let onAddMusic = (e:any) => {
    setMusicLoading(true)

    const file = e.target.files[0]
    var storeAs = "music/" + file.name
    client.multipartUpload(storeAs, file).then((res:any) => { // 上传
      setMusicLoading(false)

      console.log(res, '上传成功信息')
      let str = res.res.requestUrls[0]
      if(str.indexOf('?uploadId') === -1){
        setResultUrl(str) // 上传文件Url
      } else {
        str = str.substring(0, str.indexOf('?uploadId'))
        setResultUrl(str)
      }
      setResultName(res.name) // 存储返回的名称（以备删除）
    }).catch((err:any) => {
      setMusicLoading(false)
      console.log('上传失败：', err)
      window.alert('上传失败，请重新上传')
    })
  }

  let onAddAlbumArt = (e:any) => {
    setMusicLoading(true)

    const file = e.target.files[0]
    var storeAs = "albumArt/" + file.name
    client.multipartUpload(storeAs, file).then((res:any) => { // 上传
      setMusicLoading(false)
      console.log(res, '上传成功信息')
      let str = res.res.requestUrls[0]
      if(str.indexOf('?uploadId') === -1){
        setResultPicUrl(str) // 上传文件Url
      } else {
        str = str.substring(0, str.indexOf('?uploadId'))
        setResultPicUrl(str)
      }
    }).catch((err:any) => {
      setMusicLoading(false)
      console.log('上传失败：', err)
      window.alert('上传失败，请重新上传')
    })
  }

  return (
    <div id="addMusic">
      {/* 添加音乐 Modal 框 */}
      <Modal
        title="添加音乐"
        visible={ musicContext.state.AddVisible }
        onOk={ handleOk }
        confirmLoading={ confirmLoading }
        onCancel={ () => musicContext.dispatch({ type: 'closeAdd'}) }
        okText="添加"
        cancelText="取消"
      >

        <Spin spinning={ musicLoading }>
        <Form {...formItemLayout}>
          <Form.Item label="音乐名称：">
            <Input 
              value={ musicName } 
              placeholder="请输入音乐名称"
              onChange={(e) => setMusicName(e.target.value)} />
          </Form.Item>

          <Form.Item label="音乐人：">
            <Input 
              value={ singerName } 
              placeholder="请输入音乐人名称"
              onChange={(e) => setSingerName(e.target.value)} />
          </Form.Item>

          <Form.Item label="源文件：">
            <input 
              type="file" 
              multiple={ true }
              accept="audio/mp3,audio/mp4" 
              onChange={ onAddMusic }
              name="uploadMusic"
              id="uploadMusic" />
          </Form.Item>

          <Form.Item label="专辑图片：">
            <input 
              type="file" 
              multiple={ true }
              accept="image/gif,image/jpeg,image/jpg,image/png" 
              onChange={ onAddAlbumArt }
              name="uploadAlbumArt"
              id="uploadAlbumArt" />
          </Form.Item>

          {/* <Form.Item label="歌词：">
            <Input placeholder="请输入歌词"/>
          </Form.Item> */}

          {/* <Form.Item label="音乐名称：">
            <Input placeholder="请输入音乐名称"/>
          </Form.Item> */}
        </Form>
        </Spin>
      </Modal>
    </div>
  );
}

export default AddMusic