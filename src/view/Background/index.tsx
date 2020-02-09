import * as React from 'react';

import './index.scss'

import { getBackground, addBackground, deleteBackground} from 'src/api/Background'

import { notification, Spin, Popconfirm } from 'antd';

import client from 'src/config/oss-config'

const Background: React.FC = () => {
  const [ uploadLoading, setupLoadLoading ] = React.useState(false)
  const [ backgroundUrl, setBackgroundUrl ] = React.useState({_id: '', url: ''})

  React.useEffect(() => {
    fetchBackgroundData()
  }, [])

  const inputFile:any = React.useRef(null)


  let fetchBackgroundData = () => {
    getBackground().then((res:any) => {
      if(res.length === 0) {
        console.log('没有返回图片')
      } else {
        setBackgroundUrl(res[0])
      }
    })
  }

  let uploadImg = () => {
    if(backgroundUrl.url === '') {
      inputFile.current.click()
    } else {
      console.log('已有背景')
      return
    }
  }

  let onAddBackground = (e:any) => {
    setupLoadLoading(true)

    const file = e.target.files[0]
    var storeAs = "background/" + file.name
    client.multipartUpload(storeAs, file).then((res:any) => { // 上传
      setupLoadLoading(false)
      console.log(res, '上传成功信息')
      let str = res.res.requestUrls[0]

      if(str.indexOf('?uploadId') === -1){
        
      } else {
        str = str.substring(0, str.indexOf('?uploadId'))
      }

      addBackground(str).then((res) => { // 传入数据库
        notification['success']({ message: '添加背景成功' })
        fetchBackgroundData()
      }).catch(err => {
        console.log(err, '添加失败')
      })

    }).catch((err:any) => {
      setupLoadLoading(false)
      console.log('上传失败：', err)
      window.alert('上传失败，请重新上传')
    })
  }

  let handleDelBackground = (e:any) => {
    e.stopPropagation()
    console.log('删除按钮')
    deleteBackground(backgroundUrl._id).then(() => {
      setBackgroundUrl({_id: '', url: ''})
      notification['success']({ message: '删除背景成功' })
    })
  }

  const backgroundStyle = (): React.CSSProperties => ({
    backgroundImage: `url(${backgroundUrl.url})`
  })

  return (
      <div id="Background">
        <Spin spinning={ uploadLoading }>
        <div className="upload-frame" style={ backgroundStyle() }  onClick={ uploadImg }>
          
          <Popconfirm
            title="是否选择残忍删除？"
            onConfirm={(e) => { handleDelBackground(e) }}
            okText="那么难看，我就是那么残忍"
            cancelText="算了，心软了"
          >
            <div className="delete-background">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-error"></use>
              </svg>
            </div>
          </Popconfirm>

          <div className="add-logo" style={ backgroundUrl.url === '' ? { display: 'block' } : { display: 'none' } }>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-add"></use>
            </svg>
            <p>上传背景图</p>
          </div>
        </div>
        </Spin>
        
        <input
          ref={ inputFile }
          className="background-file"
          type="file" 
          multiple={ true }
          accept="image/gif,image/jpeg,image/jpg,image/png" 
          onChange={ onAddBackground }
          name="uploadMusic"
          id="uploadMusic" />
      </div>
      
    
  );
}

export default Background