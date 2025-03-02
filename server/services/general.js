export const getCountOfSchema=(Schema,constraints)=>{
   return Schema.countDocuments(constraints)
}