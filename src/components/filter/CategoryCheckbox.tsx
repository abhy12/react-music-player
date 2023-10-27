interface CategoryCheckboxProps{
   id: string,
   name: string,
   label: string,
}

export default function CategoryCheckbox( { id, name, label }: CategoryCheckboxProps ) {
   return(
      <div className="flex items-center flex-wrap">
         <input
            className="appearance-none mr-2 w-5 h-5 border border-white checked:border-primary-blue rounded checked:bg-primary-blue custom-checkbox"
            type="checkbox"
            name={name}
            id={id}
            value={id}
         />
         <label htmlFor={id}>{label}</label>
      </div>
   )
}
