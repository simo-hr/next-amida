import React, { FC, ChangeEvent, useState, useEffect } from 'react'

interface MultiLineInputProps {
  inputList: string[]
  setInputList: React.Dispatch<React.SetStateAction<string[]>>
}

const MultiLineInput: FC<MultiLineInputProps> = ({ inputList, setInputList }) => {
  const [textAreaValue, setTextAreaValue] = useState(inputList.join('\n'))

  useEffect(() => {
    setTextAreaValue(inputList.join('\n'))
  }, [inputList])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const lines = value.split('\n')
    // 空行が連続する場合は削除
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === '' && lines[i + 1] === '') {
        lines.splice(i, 1)
        i--
      }
    }
    setInputList(lines)
    setTextAreaValue(value)
  }

  return (
    <div>
      <textarea rows={10} cols={50} value={textAreaValue} onChange={handleChange} />
    </div>
  )
}

export default MultiLineInput
