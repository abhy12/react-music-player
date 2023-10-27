import CategoryCheckbox from "./CategoryCheckbox";
import { FilterInfoType } from "../../../util/util";
import { Accordion, AccordionItem } from '@szhsin/react-accordion';

export default function CategoryFilter( { categories }: FilterInfoType ) {
   return(
      <Accordion transition={true} transitionTimeout={200}>
         {Object.keys( categories ).map( cat =>
         <AccordionItem key={cat} header={cat}>
            { // @ts-ignore
            categories[cat].map( filter =>
               <CategoryCheckbox
                  key={filter.id}
                  id={filter.id}
                  name={cat}
                  label={filter.name}
               />
            )}
         </AccordionItem>
         )}
      </Accordion>
   )
}
