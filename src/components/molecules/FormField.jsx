import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'

const FormField = ({ 
  type = 'text',
  options = [],
  ...props 
}) => {
  if (type === 'select') {
    return <Select options={options} {...props} />
  }
  
  return <Input type={type} {...props} />
}

export default FormField