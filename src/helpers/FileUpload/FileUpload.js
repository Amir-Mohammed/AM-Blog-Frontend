import React from "react";

function FileUpload(props) {
  const { field, form } = props;
  const handleChange = (e) => {
    const imgTag = document.getElementById("myimage");
    const file = e.currentTarget.files[0];
    const reader = new FileReader();
    imgTag.title = file.name;
    reader.onload = function (event) {
      imgTag.src = event.target.result;
      imgTag.className = "img-thumbnail";
    };
    reader.readAsDataURL(file);
    form.setFieldValue(field.name, file);
  };

  return (
    <div>
      <div className="form-group pb-2">
        <h5>{props.description || ""} Image</h5>
        <hr />

        <small className="text-muted">Max size: 1mb</small>
        <br />
        <label className="btn btn-outline-info">
          Upload {props.description || ""} Image
          <input
            type={"file"}
            onChange={(o) => handleChange(o)}
            className={"form-control"}
            accept="image/*"
            hidden
          />
        </label>
        <img src={""} alt="" id={"myimage"} className="" />
      </div>
    </div>
  );
}

export default FileUpload;
