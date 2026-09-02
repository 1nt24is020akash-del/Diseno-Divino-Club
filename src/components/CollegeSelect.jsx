import BranchSelect from './BranchSelect'
import { colleges } from '../data/collegeOptions'

export default function CollegeSelect({ value, onChange, hasError }) {
  return (
    <BranchSelect
      value={value}
      onChange={onChange}
      hasError={hasError}
      options={colleges}
      placeholder="Select your college"
      noMatchText="No matching college found"
      fieldLabel="Select your college"
      searchPlaceholder="Search your college..."
    />
  )
}