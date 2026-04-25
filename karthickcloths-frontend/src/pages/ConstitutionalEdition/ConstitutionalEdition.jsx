import MenWear from "../MenSection/MenWear";
import { constitutionalProductsFallback } from "./constitutionalProductsData";

function ConstitutionalEdition({ isDark, onSelectProduct }) {
    return (
        <MenWear
            isDark={isDark}
            onSelectProduct={onSelectProduct}
            categoryKey="constitutional"
            routeBase="/constitutional-edition"
            pageTitle="Constitutional Edition"
            pageDescription="A premium constitutional drop with iconic statements, elevated fits, and the same smooth shopping experience as our main menswear section."
            fallbackProducts={constitutionalProductsFallback}
        />
    );
}

export default ConstitutionalEdition;
