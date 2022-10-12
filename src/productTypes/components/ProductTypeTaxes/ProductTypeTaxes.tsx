import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import { ProductTypeDetailsQuery } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { FetchMoreProps, RelayToFlat } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import { ProductTypeForm } from "../ProductTypeDetailsPage/ProductTypeDetailsPage";

interface ProductTypeTaxesProps {
  data: {
    taxClassId: string;
  };
  taxClassDisplayName: string;
  taxClasses: RelayToFlat<ProductTypeDetailsQuery["taxClasses"]>;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
  onFetchMore: FetchMoreProps;
}

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible",
    },
  },
  { name: "ProductTypeTaxes" },
);

const ProductTypeTaxes: React.FC<ProductTypeTaxesProps> = props => {
  const {
    data,
    disabled,
    taxClasses,
    taxClassDisplayName,
    onChange,
    onFetchMore,
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card className={classes.root}>
      <CardTitle
        title={intl.formatMessage({
          id: "mUb8Gt",
          defaultMessage: "Taxes",
          description: "section header",
        })}
      />
      <CardContent>
        <SingleAutocompleteSelectField
          disabled={disabled}
          displayValue={taxClassDisplayName}
          label={intl.formatMessage({
            id: "kQjY56",
            defaultMessage: "Tax class",
          })}
          name={"taxClassId" as keyof ProductTypeForm}
          onChange={onChange}
          value={data.taxClassId}
          choices={taxClasses.map(choice => ({
            label: choice.name,
            value: choice.id,
          }))}
          InputProps={{
            autoComplete: "off",
          }}
          {...onFetchMore}
        />
      </CardContent>
    </Card>
  );
};
ProductTypeTaxes.displayName = "ProductTypeTaxes";
export default ProductTypeTaxes;
