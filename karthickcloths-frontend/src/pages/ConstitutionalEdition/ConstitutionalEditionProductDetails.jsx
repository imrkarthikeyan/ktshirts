import MenWearProductDetails from "../MenSection/MenWearProductDetails";
import { constitutionalProductsFallback } from "./constitutionalProductsData";

function ConstitutionalEditionProductDetails({ isDark }) {
    return (
        <MenWearProductDetails
            isDark={isDark}
            categoryKey="constitutional"
            routeBase="/constitutional-edition"
            pageLabel="Constitutional Edition"
            whatsappPhone="8667015665"
            fallbackProducts={constitutionalProductsFallback}
        />
    );
}

export default ConstitutionalEditionProductDetails;
