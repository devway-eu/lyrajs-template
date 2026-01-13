import { Base } from "@app/templates/layout/Base"

export default function ExampleRender({
  title,
  content,
  documentationUrl
}: {
  title: string
  content: string
  documentationUrl: string
}) {
  return (
    <Base>
      <section>
        <h1>{title}</h1>
        <p>{content}</p>
      </section>
    </Base>
  )
}
