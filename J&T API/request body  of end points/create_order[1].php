<?php

$customerCode = "J0086004385";
$password = "Jt123456";
$apiAccount = "663390130932817921";
$private_key = "20180ff83ca04442840339c682f951b5";

$hashPass = strtoupper(md5($password . "jadada236t2"));
$bodyDigest = base64_encode(pack('H*', md5($customerCode . $hashPass . $private_key)));

         
              $body = json_encode([
                "customerCode" => $customerCode,
                "digest" => $bodyDigest,
                "txlogisticId" => "test0120",
                "operateType" => 1,
                "expressType" => "EZ",
                "deliveryType" => "04",
                "payType" => "PP_PM",
                "goodsType" => "ITN16",
                "weight" => "1",
                "totalQuantity" => 1,
                "itemsValue" => "",
                "priceCurrency" => "EGP",
                "remark" => "test",
                "pickInfo" => "test",
                "offerFee" => "",
                "exdrDescription" => "",
                "sender" => [
                    "name" => "test1",
                    "mobile" => "01234567890",
                    "phone" => "01234567890",
                    "countryCode" => "EGY",
                    "prov" => "cairo",
                    "city"=> "cairo",
                    "area"=> "cairo",
                    "street"=> "cairo",
                ],
                "receiver"=> [
                    "name" => "test2",
                    "mobile" => "01234567890",
                    "phone" => "01234567890",
                    "countryCode" => "EGY",
                    "prov" => "الجيزة",
                    "city"=> "الهرم",
                    "area"=> "نصر الثورة",
                    "street"=> "نصر الثورة",
                ],
                "items"=> [
                    "itemName" => "test",
                    "itemValue" => "100",
            ]
              ]);



$headerDigest = base64_encode(pack('H*', strtoupper(md5($body . $private_key))));


















$headers = [
    "apiAccount: $apiAccount",
    "timestamp: " . time(),
    "digest: $headerDigest",
];

$api_url = "https://openapi.jtjms-eg.com/webopenplatformapi/api/order/addOrder";
$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_URL => $api_url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query(['bizContent' => $body]),
    CURLOPT_HTTPHEADER => $headers,
));
















$response = curl_exec($curl);

if ($response === false) {
    echo "cURL Error: " . curl_error($curl);
} else {
    echo "Response: " . $response;
}

curl_close($curl);
