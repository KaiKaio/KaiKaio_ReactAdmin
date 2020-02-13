import * as React from 'react';
import { useRouteMatch } from 'react-router-dom';

import axios from 'src/config/axios'

import { Spin, Modal } from 'antd';

import { Input } from 'antd';
import client from 'src/config/oss-config'

import Editor from 'for-editor'

import './index.scss'

const { confirm } = Modal;

const MarkdownEditor: React.FC = (props:any, ref:any) => {
  const match:any = useRouteMatch()

  const [ value, setValue ] = React.useState('')
  const [ uploadLoading, setupLoadLoading ] = React.useState(false)
  const [ coverUrl, setCoverUrl ] = React.useState('')
  const [ title, setTitle ] = React.useState('')
  const [ description, setDescription ] = React.useState('')
  const [ id, setId ] = React.useState('')

  const MEditor:any = React.useRef(null)
  const inputFile:any = React.useRef(null)

  React.useImperativeHandle(ref, ()=>({
    id: id,
    value: value,
    title: title,
    description: description,
    coverUrl: coverUrl
  }));

  React.useEffect(() => {
    if(match.params.id) {
      axios.get(`/Article/?id=${match.params.id}`).then((res) => {
        const data = res.data.data
        setValue(data[0].content)
        setTitle(data[0].title)
        setDescription(data[0].description)
        setId(data[0]._id)
        setCoverUrl(data[0].cover)
      }).catch((err:any) => {
        console.log(err, '请求错误')
      })
    } else {
      console.log('没有需要编辑的文章')
    }
  }, [match.params.id])


  let handleUpload = () => {
    if(coverUrl === '' || coverUrl === null) {
      inputFile.current.click()
    } else {
      console.log('已有封面')
      return
    }
  }
  
  let onAddCover = (e:any) => {
    setupLoadLoading(true)

    const file = e.target.files[0]
    let storeAs = "article/" + file.name
    client.multipartUpload(storeAs, file).then((res:any) => { // 上传
      setupLoadLoading(false)
      let str = res.res.requestUrls[0]
      if(str.indexOf('?uploadId') === -1){
        
      } else {
        str = str.substring(0, str.indexOf('?uploadId'))
      }

      setCoverUrl(str)

    }).catch((err:any) => {
      setupLoadLoading(false)
      window.alert('上传失败，请重新上传')
    })
  }

  let handleChange = (value: string) => {
    setValue(value)
  }

  let addImg = ($file: any) => {
    var storeAs = "markdowmImg/" + $file.name
    client.multipartUpload(storeAs, $file).then((res:any) => { // 上传
      console.log(res, '上传成功信息')
      let str = res.res.requestUrls[0]
      if(str.indexOf('?uploadId') === -1){
        MEditor.current.$img2Url($file.name, str)
      } else {
        str = str.substring(0, str.indexOf('?uploadId'))
        MEditor.current.$img2Url($file.name, str)
      }
    }).catch((err:any) => {
      console.log('上传失败：', err)
      window.alert('上传失败，请重新上传')
    })
  }

  let handleDelCover = (e:any) => {
    confirm({
      title: '确定删掉这张图片？',
      content: '如果你删掉不保存，其实还是删不掉的咧',
      okText: '就要删啊，怎样',
      cancelText: '算了',
      onOk() {
        setCoverUrl('')
      },
      onCancel() {
        alert('以后小心点')
      },
    })

  }

  const backgroundStyle = (): React.CSSProperties => ({
    backgroundImage: `url(${coverUrl})`,
    backgroundSize: 'cover'
  })

  return (
    <Spin spinning={ uploadLoading }>
    <div id="MarkdownEditor">
      <label className="edit-label" htmlFor="title">标题：</label>
      <Input
        className="edit-input"
        placeholder="请输入本文章标题"
        value={ title } 
        onChange={(e) => setTitle(e.target.value)}
        id="title"
      />
      
      <label className="edit-label" htmlFor="description">描述：</label>
      <Input
        className="edit-input"
        placeholder="请输入本文章描述"
        value={ description } 
        onChange={(e) => setDescription(e.target.value)}
        id="description"
      />

      <label className="edit-label">封面：</label>
      <div className="upload-area" style={ backgroundStyle() } onClick={ handleUpload }>

        <div onClick={ handleDelCover } style={ coverUrl === '' || coverUrl === null ? { display: 'none' } : { display: 'flex' } } className="delete-background">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-error"></use>
          </svg>
        </div>

        <input
          ref={ inputFile }
          className="background-file"
          type="file" 
          multiple={ true }
          accept="image/gif,image/jpeg,image/jpg,image/png" 
          onChange={ onAddCover }
          name="uploadMusic"
          id="uploadMusic" />
      </div>

      <Editor 
        ref={ MEditor }
        value={ value }
        addImg={($file) => addImg($file)}
        onChange={(value) => handleChange(value)} 
      />
    </div>
    </Spin>
  );
}

export default React.forwardRef(MarkdownEditor)