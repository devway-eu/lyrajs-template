import { Base } from "@templates/layout/Base"

export default function ExampleRender({ title }: { title: string }) {
  return (
    <Base>
      <h1>{title}</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita laborum magnam nam necessitatibus provident
        rerum!
      </p>
    </Base>
  )
}
