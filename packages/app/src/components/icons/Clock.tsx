const OwnedIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        aspectRatio: "13 / 13",
      }}
    >
      <path
        d="M11.1869 4.62464C11.1869 4.48557 11.2282 4.34963 11.3054 4.234C11.3827 4.11838 11.4925 4.02825 11.621 3.97504C11.7495 3.92182 11.8908 3.90789 12.0272 3.93502C12.1636 3.96216 12.2889 4.02912 12.3872 4.12746C12.4856 4.22579 12.5525 4.35107 12.5797 4.48747C12.6068 4.62386 12.5929 4.76523 12.5397 4.89371C12.4864 5.02219 12.3963 5.13201 12.2807 5.20927C12.1651 5.28653 12.0291 5.32776 11.8901 5.32776C11.7036 5.32776 11.5247 5.25369 11.3929 5.12182C11.261 4.98996 11.1869 4.81112 11.1869 4.62464ZM10.4838 3.21839C10.6229 3.21839 10.7588 3.17715 10.8744 3.09989C10.9901 3.02263 11.0802 2.91282 11.1334 2.78434C11.1866 2.65586 11.2006 2.51448 11.1734 2.37809C11.1463 2.2417 11.0793 2.11641 10.981 2.01808C10.8827 1.91975 10.7574 1.85278 10.621 1.82565C10.4846 1.79852 10.3432 1.81244 10.2147 1.86566C10.0863 1.91888 9.97644 2.009 9.89918 2.12463C9.82192 2.24026 9.78068 2.3762 9.78068 2.51526C9.78068 2.70175 9.85476 2.88059 9.98662 3.01245C10.1185 3.14431 10.2973 3.21839 10.4838 3.21839ZM12.1631 6.49964C12.0393 6.48943 11.9164 6.52881 11.8216 6.60912C11.7268 6.68944 11.6677 6.80412 11.6574 6.92796C11.5736 7.90792 11.2115 8.84353 10.6139 9.62471C10.0164 10.4059 9.20808 11.0001 8.28422 11.3375C7.36036 11.6749 6.35936 11.7415 5.39898 11.5293C4.43861 11.3171 3.55882 10.835 2.86313 10.1397C2.16744 9.44447 1.6848 8.56498 1.472 7.60474C1.25919 6.6445 1.32508 5.64345 1.6619 4.71938C1.99871 3.79531 2.59246 2.98667 3.37326 2.38859C4.15407 1.79052 5.08945 1.42789 6.06935 1.34339C6.13091 1.33831 6.19087 1.32116 6.24579 1.29291C6.30072 1.26466 6.34955 1.22587 6.38948 1.17875C6.42942 1.13163 6.45968 1.07711 6.47855 1.01829C6.49741 0.959479 6.50451 0.897525 6.49943 0.835968C6.49435 0.77441 6.4772 0.714456 6.44895 0.659528C6.4207 0.6046 6.38191 0.555774 6.33479 0.515838C6.28767 0.475902 6.23315 0.445637 6.17434 0.426772C6.11552 0.407907 6.05357 0.400811 5.99201 0.405889C4.83421 0.505479 3.72894 0.933669 2.80623 1.64008C1.88352 2.3465 1.18176 3.30175 0.783512 4.39345C0.385262 5.48515 0.307091 6.66788 0.558195 7.8025C0.809299 8.93712 1.37923 9.97642 2.20094 10.7981C3.02265 11.6198 4.06195 12.1898 5.19657 12.4409C6.33119 12.692 7.51392 12.6138 8.60562 12.2156C9.69732 11.8173 10.6526 11.1155 11.359 10.1928C12.0654 9.27013 12.4936 8.16486 12.5932 7.00706C12.5985 6.94546 12.5915 6.88343 12.5727 6.82452C12.554 6.76562 12.5237 6.71101 12.4837 6.66385C12.4438 6.61669 12.3949 6.5779 12.3398 6.54971C12.2848 6.52153 12.2247 6.50451 12.1631 6.49964ZM6.49943 2.28089C7.33382 2.28089 8.14947 2.52831 8.84324 2.99188C9.53701 3.45544 10.0777 4.11432 10.397 4.88519C10.7164 5.65607 10.7999 6.50432 10.6371 7.32268C10.4743 8.14103 10.0725 8.89274 9.48254 9.48275C8.89254 10.0727 8.14083 10.4745 7.32247 10.6373C6.50411 10.8001 5.65586 10.7166 4.88499 10.3973C4.11411 10.0779 3.45523 9.53722 2.99167 8.84345C2.52811 8.14968 2.28068 7.33403 2.28068 6.49964C2.28192 5.38114 2.7268 4.3088 3.5177 3.5179C4.3086 2.727 5.38093 2.28213 6.49943 2.28089ZM6.03068 6.49964C6.03068 6.62396 6.08007 6.74319 6.16798 6.8311C6.25588 6.919 6.37511 6.96839 6.49943 6.96839H9.31193C9.43625 6.96839 9.55548 6.919 9.64339 6.8311C9.7313 6.74319 9.78068 6.62396 9.78068 6.49964C9.78068 6.37532 9.7313 6.25609 9.64339 6.16818C9.55548 6.08028 9.43625 6.03089 9.31193 6.03089H6.96818V3.68714C6.96818 3.56282 6.9188 3.44359 6.83089 3.35568C6.74298 3.26778 6.62375 3.21839 6.49943 3.21839C6.37511 3.21839 6.25588 3.26778 6.16798 3.35568C6.08007 3.44359 6.03068 3.56282 6.03068 3.68714V6.49964ZM8.37443 1.81214C8.5135 1.81214 8.64944 1.7709 8.76507 1.69364C8.8807 1.61638 8.97082 1.50657 9.02403 1.37809C9.07725 1.24961 9.09118 1.10823 9.06405 0.971842C9.03692 0.835449 8.96995 0.710164 8.87162 0.61183C8.77328 0.513496 8.648 0.44653 8.5116 0.4194C8.37521 0.39227 8.23384 0.406194 8.10536 0.459412C7.97688 0.51263 7.86707 0.602751 7.7898 0.718379C7.71254 0.834007 7.67131 0.969949 7.67131 1.10901C7.67131 1.29549 7.74539 1.47434 7.87725 1.6062C8.00911 1.73806 8.18795 1.81214 8.37443 1.81214Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default OwnedIcon;
