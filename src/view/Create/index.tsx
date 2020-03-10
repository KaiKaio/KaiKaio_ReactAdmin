import * as React from 'react';

import axios from 'src/config/axios'

import { Button, notification } from 'antd';

import MarkdownEditor from '../../components/Util/MarkdownEditor'

import './index.scss'

const Create: React.FC = () => {
  const [ loading, setLoading ] = React.useState(false)
  const [ iconLoading, setIconLoading ] = React.useState(false)

  const Editor:any = React.useRef(null)

  let submit = () => {
    setLoading(!loading)
    setIconLoading(!iconLoading)
    axios.post('/Article/Add', {
      content: Editor.current.value,
      title: Editor.current.title,
      description: Editor.current.description,
      cover: Editor.current.coverUrl
    }).then((res) => {
      console.log(res, '添加成功信息')
      setTimeout(() => {
        setLoading(loading)
        setIconLoading(iconLoading)
        notification['success']({ message: '添加文章成功' })
      }, 1500)
    }).catch(err => {
      console.log(err, '提交编辑错误信息')
      setTimeout(() => {
        setLoading(loading)
        setIconLoading(iconLoading)
      }, 1500)
    })
  }

  return (

    <div id="create">
      
      <MarkdownEditor ref={ Editor }/>

      <Button
        loading={ loading }
        onClick={ () => submit() }
        type="primary"
      >发表文章</Button>
    </div>
  );
}

export default Create