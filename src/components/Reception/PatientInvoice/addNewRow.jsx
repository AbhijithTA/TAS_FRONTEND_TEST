// eslint-disable-next-line react/prop-types
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import SelectBox from "../../Utils/SelectBox";
import TextFieldInput from "../../Utils/inputbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import showAlert from "../../../Utils/showAlert"; 
import { useMemo } from "react";

function NewItemRow({   onAdd, sl,procedures }) {   
  const datalist = procedures?.map((item) => ({
    type: item?.procedure,
    description: item?.description,
    _id: item?._id,
    HSNCode: item?.HSNCode,
    GST: item?.GST,
  }));



  const [newItem, setNewItem] = useState({
    ProcedureID: "",
    procedure: "", 
    quantity: 1,
    unitPrice: 0,
    discountType: "INR",
    HSNCode: "",
    discount: 0,
    totalAmount: 0,
    amountToBePaid: 0,
    GST: 0,
    baseAmount: 0,
    gstAmount: 0,
  });
  
  useEffect(() => {
    setNewItem({
      ProcedureID: "",
      procedure: "",
      quantity: 1,
      unitPrice: 0,
      discountType: "INR",
      HSNCode: "",
      discount: 0,
      totalAmount: 0,
      amountToBePaid: 0,
      GST: 0,
      baseAmount: 0,
      gstAmount: 0,
    });
  }, [procedures]);

  const calculateTotal = (unitPrice, quantity, discount, discountType) => {
    let total = unitPrice * quantity;
    const discountValue =
      discountType === "INR" ? discount : (total * discount) / 100;
    total = total - discountValue;
    return Math.max(total, 0);
  };
  const calculatedValues = useMemo(() => {
    const totalAmount = newItem.unitPrice * newItem.quantity;
    const amountToBePaid = calculateTotal(
      newItem.unitPrice,
      newItem.quantity,
      newItem.discount,
      newItem.discountType
    );
    const baseAmount = (amountToBePaid / (1 + newItem.GST / 100)).toFixed(2);
    const gstAmount = (baseAmount * newItem.GST / 100).toFixed(2);

    return { totalAmount, amountToBePaid, baseAmount, gstAmount };
  }, [newItem.unitPrice, newItem.quantity, newItem.discount, newItem.discountType, newItem.GST]);

  useEffect(() => {
    setNewItem((prev) => ({
      ...prev,
      ...calculatedValues,
    }));
  }, [calculatedValues]);
 
  const handleDropdown = (value) => {
    const data = datalist.find((obj) => obj.type === value) || {}; 
    setNewItem((prev) => ({
      ...prev,
      procedure: value || "",  
      ProcedureID: data?._id || "",
      GST: data?.GST || 0,
      HSNCode: data?.HSNCode || '',
    }));
  };

  const updateField = (field, value) => {
    setNewItem((prevItem) => ({ ...prevItem, [field]: value }));
  };



  const handleAddClick = () => {
    if (!newItem.procedure) {
      showAlert("Procedure Required.!", " ", "warning");
      return;
    }
    if (newItem.quantity <= 0) {
      showAlert("Quantity Required.!", " ", "warning");
      return;
    }
    if (newItem.unitPrice <= 0) {
      showAlert("Unit Price Required.!", " ", "warning");
      return;
    }
    onAdd(newItem);
    setNewItem({
      ProcedureID: "",
      procedure: "", 
      quantity: 1,
      unitPrice: 0,
      discountType: "INR",
      HSNCode: "",
      discount: 0,
      totalAmount: 0,
      amountToBePaid: 0,
      GST: 0,
      baseAmount: 0,
      gstAmount: 0,
    })
  };

  const discountTypeOptions = [{ type: "INR" }, { type: "%" }]; 
  return (
    <tr className="border-none text-center ">
      <td className="text-center">{sl}</td>
      <td className="p-2 w-[20%]">  
        <SelectBox
          id={"procedure"}
          label={"Procedure"}
          options={datalist}
          fullWidth
          onChange={(selectedValue) => handleDropdown(selectedValue)}
          value={newItem?.procedure}
        />
      </td>
      <td className="p-2 w-[7%]">
        <TextFieldInput
          label="HSNCode"
          name="HSNCode"
          type="text"
          // className="w-32 2xl:w-auto"
          disabled
          value={newItem.HSNCode}
          onChange={(e) => updateField("HSNCode", Number(e.target.value))}
        />
      </td>
      <td className="p-2 w-[7%]">
        <TextFieldInput
          label="Qty"
          name="quantity"
          type="number"
          // className="w-16 2xl:w-auto"
          value={newItem.quantity}
          onChange={(e) => updateField("quantity", Number(e.target.value))}
        />
      </td>
      <td className="p-2 w-[10%]">
        <TextFieldInput
          label="Unit Price"
          name="unitPrice"
          // className="w-32 2xl:w-auto"
          type="number"
          value={newItem.unitPrice}
          onChange={(e) => updateField("unitPrice", Number(e.target.value))}
        />
      </td>
      <td className="pl-2 w-[15%]">
        <div className="flex w-full">
          <div className="w-1/2">
            {" "}
            <TextFieldInput
              label="Discount"
              name="discount"
              type="number"
              // className="w-16 2xl:w-auto"
              value={newItem.discount}
              onChange={(e) => {
                updateField("discount", Number(e.target.value));
              }}
            />
          </div>
          <div className="w-1/2">
            {" "}
            <SelectBox
              id="discountType"
              label="Type"
              options={discountTypeOptions}
              onChange={(value) => updateField("discountType", value)}
              value={newItem?.discountType}
            />
          </div>
        </div>
      </td>
      <td className="p-2  w-[10%]">
        <TextFieldInput
          label={"GST %"}
          name={"GST"}
          disabled
          // className="w-16 2xl:w-auto"
          type={"number"}
          value={newItem?.GST}
          onChange={(e) => {
            updateField("GST", Number(e.target.value));
          }}
        />
      </td>

      <td className="p-2  w-[10%]">
        <TextFieldInput
          label={"Taxable Amount"}
          name={"baseAmount"}
          disabled
          // className="w-16 2xl:w-auto"
          type={"number"}
          value={newItem?.baseAmount}
          onChange={(e) => {
            updateField("discount", Number(e.target.value));
          }}
        />
      </td>

      <td className="p-2   w-[10%]">
        <TextFieldInput
          label={"GST Amount"}
          name={"gstAmount"}
          type={"number"}
          // className="w-16 2xl:w-auto"
          value={newItem.gstAmount}
          disabled
          onChange={(e) => {
            updateField("discount", Number(e.target.value));
          }}
        />
      </td>
      <td className="text-center">{newItem.amountToBePaid}</td> 
      <td className="p-2">
        <button
          className=" bg-green-400 rounded-full py-2 px-3"
          onClick={handleAddClick}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </td>
    </tr>
  );
}

export default NewItemRow;
