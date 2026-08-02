import SliderActions from "./SliderActions";

export default function SliderRow({slider,index,meta,reload}) {

    return (

        <tr>
            <td>{(meta.from || 1) + index}</td>
            <td>
                <img src={slider.image} width="90" className="rounded" alt={slider.title} />
            </td>
            <td>
                <strong>{slider.title}</strong>
                <br />
                <small>{slider.subtitle}</small>
            </td>
            <td>
                <span className={`badge bg-${
                        slider.status === "Active" ? "success" : "secondary"
                    }`}
                >
                    {slider.status}
                </span>
            </td>
            <td>
                {slider.sort_order}
            </td>
            <td>
                {slider.published_at ?? "-"}
            </td>
            <td>
                <SliderActions slider={slider} reload={reload} />
            </td>
        </tr>

    );

}