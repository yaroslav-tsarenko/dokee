"use client";

import React, { useState} from 'react';
import styles from "./TypeOfDocument.module.scss";
import {Accordion, AccordionDetails, AccordionSummary, Button, Tooltip, useMediaQuery} from "@mui/material";
import uaFlag from "@/assets/icons/ua-icon.png";
import kzFlag from "@/assets/icons/kz-icon.png";
import Image from "next/image";
import ButtonOutlined from "@/components/custom-button/ButtonOutlined";
import DocumentItem from "@/components/document-item/DocumentItem";
import documentTypes from "@/constants/documentTypes";
import {Select, Option} from '@mui/joy';
import {Input} from '@mui/joy';
import {BsFillInfoSquareFill} from "react-icons/bs";
import timeIcon from "@/assets/icons/box-time-icon.svg"
import timeIconPurple from "@/assets/icons/box-time-purple.svg"
import timeIconWhite from "@/assets/icons/box-time-white.svg"
import fast from "@/assets/icons/fastPurple.svg"
import discountPurple from "@/assets/icons/discount-purple.svg"
import discountWhite from "@/assets/icons/discount-white.svg"
import dropFile from "@/assets/icons/file-download.svg"
import lightning from "@/assets/icons/lighting-white.svg"
import garry from "@/assets/icons/garry-icon.svg"
import discount from "@/assets/icons/discount-icon.svg"
import {HiMiniArrowsRightLeft} from "react-icons/hi2";
import TariffItem from '@/components/tariff-item/TariffItem';
import {useDocumentContext} from "@/context/DocumentContext";
import {IoIosArrowDown} from "react-icons/io";
import sealExample from "@/assets/images/seal-example.svg"
import stampExample from "@/assets/images/example-of-stamp.svg";
import warningExample from "@/assets/icons/icon-blue.svg"
import DocumentFinalItem from '@/components/document-final-item/DocumentFinalItem';
import {useDocumentSamples} from "@/hooks/useDocumentSamples";
import {usePopup} from "@/context/PopupContext";

type WayforpayPaymentData = {
    merchantAccount: string;
    merchantDomainName: string;
    orderReference: string;
    orderDate: number;
    amount: number;
    currency: 'KZT' | 'UAH' | 'USD' | 'EUR';
    productName: string[];
    productCount: string[];
    productPrice: string[];
    clientFirstName: string;
    clientLastName: string;
    clientEmail: string;
    clientPhone: string;
    language: 'UA' | 'RU' | 'EN';
    returnUrl: string;
    serviceUrl: string;
    merchantSignature: string;
    auth: 'SimpleSignature';
    transactionType: 'SALE';
    paymentSystems: string;
    defaultPaymentSystem: string;
    holdTimeout: number;
    orderTimeout: number;
    orderLifetime: number;
};

interface WayforpayInstance {
    run: (data: WayforpayPaymentData) => void;
}

interface WayforpayConstructor {
    new(): WayforpayInstance;
}

declare global {
    interface Window {
        Wayforpay: WayforpayConstructor;
    }
}

const TypeOfDocument = () => {

    const [activeCountry, setActiveCountry] = useState<'KZ' | 'UA'>('KZ');
    const isMobileView = useMediaQuery('(max-width:768px)');
    const {addDocument, selectedDocuments, setLanguagePair, setTariff, tariff, uploadedFiles, setUploadedFiles, activePage, setActivePage } = useDocumentContext();
    const [fromLanguage, setFromLanguage] = useState<string | null>("русский");
    const [toLanguage, setToLanguage] = useState<string | null>("польский");
    const {openPopup, closePopup} = usePopup();
    const [loading, setLoading] = useState(false);
    const [localLanguagePair, setLocalLanguagePair] = useState<string | null>("Русский - Польский");

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        setUploadedFiles([...uploadedFiles, ...files]);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setUploadedFiles([...uploadedFiles, ...files]);
    };

    const handleOpenPopup = (content: React.ReactNode) => {
        openPopup(content);
    };
    const {
        samples: selectedSamples,
        openSamples,
        toggleSampleSelection: handleSampleSelect,
        resetSamples: handleBackToList,
        removeSamplesForDocument,
    } = useDocumentSamples(activeCountry);

    const handleDocumentSelect = (documentName: string) => {
        const doc = selectedDocuments.find((doc) => doc.name === documentName);
        const selectedVariants = doc?.selectedSamples?.length || 0;

        if (selectedVariants > 0) {
            removeSamplesForDocument(documentName);
        } else {
            openSamples(documentName);
        }
    };

    const getUnitPrice = (tariff: string) => {
        switch (tariff) {
            case 'Normal':
                return 499;
            case 'Express':
                return 699;
            case 'Fast':
                return 899;
            default:
                return 0;
        }
    };

    const totalValueByTariff = (tariff: string) => {
        return selectedDocuments.reduce((total, doc) => {
            const count = doc.selectedSamples?.length || 1;
            return total + count * getUnitPrice(tariff);
        }, 0);
    };

    const totalValue = selectedDocuments.reduce((total, doc) => {
        const count = doc.selectedSamples?.length || 1;
        return total + count * getUnitPrice(tariff || '');
    }, 0);

    const handleLanguagePairChange = (from: string | null, to: string | null) => {
        if (from && to && from !== to) {
            const formatted = `${capitalize(from)} - ${capitalize(to)}`;
            setLanguagePair(formatted);
            setLocalLanguagePair(formatted);
        }
    };
    const scrollToSection = (id: string) => {
        if (id === "header") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            const section = document.getElementById(id);
            if (section) {
                const offset = id === "footer" ? 0 : window.innerHeight * 0.2;
                const top = id === "footer"
                    ? document.body.scrollHeight - window.innerHeight
                    : section.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: "smooth" });
            } else {
                console.error(`Element with id "${id}" not found.`);
            }
        }
    };
    const handleNextStep = () => {
        setActivePage(activePage + 1);
        scrollToSection("documents");
    };
    const handlePreviousStep = () => {
        setActivePage(activePage - 1);
        scrollToSection("documents");
    };
    const capitalize = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const handleClosePopup = () => {
        closePopup();
        setActivePage(activePage + 1);
    }
    const handleSendData = async () => {
        setLoading(true);

        try {
            const formData = new FormData();

            formData.append('email', 'dokee.pro@gmail.com');
            formData.append('languagePair', localLanguagePair || "");
            formData.append('tariff', tariff || '');

            const docs = selectedDocuments.map((doc) => ({
                name: doc.name,
                fioLatin: doc.fioLatin || '',
                sealText: doc.sealText || '',
                stampText: doc.stampText || '',
                selectedSamples: doc.selectedSamples || [],
            }));

            formData.append('documents', JSON.stringify(docs));

            uploadedFiles.forEach((file) => {
                formData.append('files', file);
            });

            const response = await fetch('https://dokee-be.onrender.com/payment/send-data-to-email', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Ошибка запроса');
            }

            const result = await response.json();
            console.log('✅ Email sent successfully:', result);
            alert('Данные успешно отправлены на почту');
        } catch (error) {
            console.error('❌ Ошибка при отправке данных:', error);
            alert('Произошла ошибка при отправке данных');
        } finally {
            setLoading(false);
        }
    };
    const handleFromLanguageChange = (value: string) => {
        setFromLanguage(value);
        handleLanguagePairChange(value, toLanguage);
    };

    const now = new Date();
    const todayDate = now.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' });
    const astanaTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    astanaTime.setMinutes(0, 0, 0);
    const astanaTimeStr = astanaTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' });
    const handleToLanguageChange = (value: string) => {
        setToLanguage(value);
        handleLanguagePairChange(fromLanguage, value);
    };
    const handleTariffSelect = (selectedTariff: string) => {
        setTariff(selectedTariff);
    };

    const renderPopupContent = (title: string) => {
        switch (title) {
            case 'Печать':
                return (
                    <div className={styles.popupContent}>
                        <div className={styles.column}>
                            <h3>Пример печати</h3>
                            <Image src={sealExample} alt="image" width={281} height={211}/>
                        </div>
                        <div className={styles.column}>
                            <h3>Пример расшифровки</h3>
                            <p>Республика Казахстан Лицензия № 0000000 выдана 00 июня 0000 года Комитетом по
                                организации правовой помощи и оказанию юридических услуг населению МЮ РК Частный
                                нотариус</p>
                        </div>
                    </div>
                );
            case 'Штамп':
                return (
                    <div className={styles.popupContent}>
                        <div className={styles.column}>
                            <h3>Пример штампа</h3>
                            <Image src={stampExample} alt="image" width={281} height={211}/>
                        </div>
                        <div className={styles.column}>
                            <h3>Пример расшифровки</h3>
                            <p>Экибастузское городское отделение регистрации кадастра Павлодарский областной филиал
                                Коммерческого акционерного общества Государственной корпорации «Правительство для
                                граждан» ИЗМЕНЕНИЯ И ДОПОЛНЕНИЯ БСН 000940000220 №
                                346, 472-195-16-АК Первоначальная дата регистрации &quot;09&quot; октября 2020 г.</p>
                        </div>
                    </div>
                );
            case 'Предупреждение':
                return (
                    <div className={styles.popupContentWarning}>
                        <Image src={warningExample} alt="image" width={136} height={136}/>
                        <div className={styles.texts}>
                            <h3>Обращаем внимание</h3>
                            <p>При условии не заполнения данной информации, Вы согласны с тем, что ФИО будут переведены
                                по правилам транслитерации, а печати и штампы отображены в виде текста
                                на языке перевода:
                                (Печать нечитабельна) или (Штамп нечитабельный)</p>
                        </div>
                        <ButtonOutlined outlined sx={{borderColor: "1px solid #d6e0ec"}}
                                        onClick={handleClosePopup}>
                            Продолжить
                        </ButtonOutlined>
                    </div>
                );
            default:
                return null;
        }
    }
    const renderContent = () => {
        switch (activePage) {
            case 1:
                return <>
                    {selectedSamples ? (
                        <div className={styles.documentsContent}>
                            {selectedSamples.map((sample, index) => (
                                <DocumentItem
                                    key={index}
                                    title={sample.name}
                                    img={sample.image}
                                    onSelect={() => handleSampleSelect(sample)}/>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.documentsContent}>
                            {documentTypes[activeCountry].map((type, index) => {
                                const docInContext = selectedDocuments.find((doc) => doc.name === type.name);
                                const selectedVariants = docInContext?.selectedSamples?.length || 0;
                                const isSelected = selectedVariants > 0;
                                return (
                                    <DocumentItem
                                        key={index}
                                        title={type.name}
                                        selectedVariants={isSelected ? selectedVariants : undefined}
                                        onSelect={() => handleDocumentSelect(type.name)}
                                        selected={isSelected}/>
                                );
                            })}
                        </div>
                    )}
                </>;
            case 2:
                return (
                    <div className={styles.tariffAndLanguage}>
                        <div className={styles.languagePair}>
                            <p>Выберите языковую пару для документа</p>
                            <div className={styles.selectors}>
                                <Select
                                    value={fromLanguage}
                                    onChange={(_, value) => handleFromLanguageChange(value || "")}
                                    sx={{width: "100%"}}>
                                    <Option value="русский">Русский</Option>
                                </Select>
                                <HiMiniArrowsRightLeft size={50}/>
                                <Select
                                    value={toLanguage}
                                    onChange={(_, value) => handleToLanguageChange(value || "")}
                                    sx={{width: "100%"}}>
                                    <Option value="русский">Русский</Option>
                                    <Option value="английский">Английский</Option>
                                    <Option value="казахский">Казахский</Option>
                                    <Option value="украинский">Украинский</Option>
                                    <Option value="польский">Польский</Option>
                                </Select>
                            </div>
                            <p style={{color: "red"}}>{fromLanguage === toLanguage ? "Языковая пара не может быть одинаковой" : ""}</p>
                        </div>
                        <div className={styles.tariffs}>
                            <TariffItem
                                title="Normal"
                                description="Перевод документов завтра на утро"
                                benefits={[
                                    {iconSrc: timeIcon, text: `Гарантия доставки до ${tomorrowDate} 9:00 (Астаны)`},
                                    {iconSrc: garry, text: 'Обычная скорость перевода'},
                                    {iconSrc: discount, text: 'на 15% дешевле средней цены на рынке'},
                                ]}
                                price={totalValueByTariff("Normal")}
                                borderRadius={['30px', '0', '0', '30px']}
                                onSelect={() => handleTariffSelect('Normal')}
                                isSelected={tariff === 'Normal'}
                            />
                            <TariffItem
                                title="Express"
                                description="Перевод документов в тот же день"
                                benefits={[
                                    {iconSrc: timeIconPurple, text: `Гарантия доставки до ${todayDate} 21:00 (Астаны)`},
                                    {iconSrc: fast, text: 'Ускоряемся для быстрого перевода'},
                                    {iconSrc: discountPurple, text: 'на 25% дешевле средней цены на рынке'},
                                ]}
                                price={totalValueByTariff("Express")}
                                borderRadius={['0', '0', '0', '0']}
                                onSelect={() => handleTariffSelect('Express')}
                                isSelected={tariff === 'Express'}
                            />
                            <TariffItem
                                title="Fast"
                                description="Перевод документов за 2-3 часа"
                                benefits={[
                                    {iconSrc: timeIconWhite, text: `Гарантия доставки до ${todayDate} ${astanaTimeStr} (Астаны)`},
                                    {iconSrc: lightning, text: 'Молниеносный перевод'},
                                    {iconSrc: discountWhite, text: 'на 35% дешевле средней цены на рынке'},
                                ]}
                                price={totalValueByTariff("Fast")}
                                borderRadius={['0', '30px', '30px', '0']}
                                onSelect={() => handleTariffSelect('Fast')}
                                isSelected={tariff === 'Fast'}
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div
                        className={styles.dropFile}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}>
                        <Image src={dropFile} alt="file" width={120} height={120}/>
                        <h5>ПРЕДОСТАВЬТЕ КАЧЕСТВЕННУЮ СКАН-КОПИЮ ИЛИ ФОТО ДОКУМЕНТОВ ДЛЯ ПЕРЕВОДА</h5>
                        <h4>
                            Обращаем Ваше внимание, что в случае предоставления некачественных изображений оригинала
                            документа, Вы соглашаетесь с тем, что будет переведена лишь та часть, которая будет
                            отчетливо видна. Расшифровку печатей и штампов Вы сможете предоставить на следующем шаге.
                        </h4>
                        <label style={{cursor: 'pointer', color: '#565add', textDecoration: 'underline'}}>
                            {isMobileView ? (
                                <p><span>Загрузите</span> файлы в это окно</p>
                            ) : (
                                <p>Перетяните или <span>загрузите</span> файлы в это окно</p>
                            )}
                            <input
                                type="file"
                                multiple
                                onChange={handleFileInput}
                                style={{display: 'none'}}
                            />
                        </label>

                        {uploadedFiles.length > 0 && (
                            <ul className={styles.uploadedList}>
                                {uploadedFiles.map((file, index) => (
                                    <li key={index}>
                                        {index + 1}. {file.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                );
            case 4:
                return <div className={styles.accordionWrapper}>
                    {selectedDocuments.map((doc) => (
                        (doc.selectedSamples?.length ? doc.selectedSamples : [null]).map((sample) => (
                            <Accordion
                                key={`${doc.name}-${sample?.name || 'default'}`}
                                sx={{
                                    boxShadow: 'none',
                                    borderBottom: '1px solid #cccccc',
                                    padding: '10px 0',
                                }}>
                                <AccordionSummary expandIcon={<IoIosArrowDown/>}>
                                    <h2 className={styles.accordionTitle}>
                                        Данные для{' '}
                                        <span style={{color: '#565add'}}>{doc.name.replace(/\s*\(.*?\)/, '')}</span>
                                        {sample?.name && <> – <span>{sample.name}</span></>}
                                    </h2>
                                </AccordionSummary>
                                <AccordionDetails className={styles.accordionDetails}>
                                    <div className={styles.inputWrapper}>
                                        <p>ФИО латиницей</p>
                                        <Input
                                            value={doc.fioLatin || ''}
                                            onChange={(e) =>
                                                addDocument({name: doc.name, fioLatin: e.target.value})
                                            }
                                            fullWidth
                                            placeholder="Фамилия Имя Отчество"
                                            sx={{mb: 2}}
                                        />
                                    </div>
                                    <div className={styles.inputWrapper}>
                                        <p>
                                            Печать
                                            <Tooltip title="Что означает?">
                                                <BsFillInfoSquareFill
                                                    className={styles.icon}
                                                    onClick={() => handleOpenPopup(renderPopupContent('Печать'))}
                                                />
                                            </Tooltip>
                                        </p>
                                        <Input
                                            value={doc.sealText || ''}
                                            onChange={(e) =>
                                                addDocument({name: doc.name, sealText: e.target.value})
                                            }
                                            fullWidth
                                            placeholder="Рассшифровка печати"
                                            sx={{mb: 2}}
                                        />
                                    </div>
                                    <div className={styles.inputWrapper}>
                                        <p onClick={() => handleOpenPopup(renderPopupContent('Штамп'))}>
                                            Штамп
                                            <Tooltip title="Что означает?">
                                                <BsFillInfoSquareFill className={styles.icon}/>
                                            </Tooltip>
                                        </p>
                                        <Input
                                            value={doc.stampText || ''}
                                            onChange={(e) =>
                                                addDocument({name: doc.name, stampText: e.target.value})
                                            }
                                            fullWidth
                                            placeholder="Рассшифровка штампа"
                                        />
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        ))
                    ))}
                </div>;
            case 5:
                return (
                    <div className={styles.finalDocuments}>
                        {selectedDocuments.flatMap((doc) =>
                            (doc.selectedSamples?.length ? doc.selectedSamples : [null]).map((sample) => {
                                const baseName = doc.name.replace(/\s*\(.*?\)/, '');
                                const fullName = sample?.name ? `${baseName} (${sample.name})` : doc.name;

                                return (
                                    <DocumentFinalItem
                                        key={`${doc.name}-${sample?.name || 'default'}`}
                                        documentName={baseName}
                                        documentFullName={fullName}
                                        tariff={tariff || ''}
                                        languagePair={localLanguagePair || ''}
                                    />
                                );
                            })
                        )}
                    </div>
                );
            default:
                return <p>Invalid page.</p>;
        }
    };
    const renderButtons = () => {
        const isNextDisabled = activePage === 2 && selectedDocuments.length === 0;

        switch (activePage) {
            case 1:
                return (
                    <div className={styles.documentNavigation}>
                        {selectedSamples ?
                            <ButtonOutlined outlined sx={{borderColor: "1px solid #d6e0ec"}}
                                            onClick={handleBackToList}>
                                Выбрать ещё
                            </ButtonOutlined>
                            :
                            null
                        }
                        <ButtonOutlined onClick={
                            selectedSamples ? handleBackToList : () => handleNextStep()}
                                        disabled={isNextDisabled}>
                            Продолжить
                        </ButtonOutlined>
                    </div>
                );
            case 2:
                return (
                    <div className={styles.documentNavigation}>
                        <ButtonOutlined outlined sx={{borderColor: "1px solid #d6e0ec"}}
                                        onClick={handlePreviousStep}>
                            Назад
                        </ButtonOutlined>
                        <ButtonOutlined
                            onClick={() => handleNextStep()}>
                            Продолжить
                        </ButtonOutlined>
                    </div>
                );
            case 3:
                return (
                    <div className={styles.documentNavigation}>
                        <ButtonOutlined outlined sx={{borderColor: "1px solid #d6e0ec"}}
                                        onClick={() => handlePreviousStep()}>
                            Назад
                        </ButtonOutlined>
                        <ButtonOutlined
                            onClick={() => handleNextStep()}>
                            Продолжить
                        </ButtonOutlined>
                    </div>
                );
            case 4:
                return (
                    <div className={styles.documentNavigation}>
                        <ButtonOutlined outlined sx={{borderColor: "1px solid #d6e0ec"}}
                                        onClick={() => handlePreviousStep()}>
                            Назад
                        </ButtonOutlined>
                        <ButtonOutlined
                            onClick={() => handleOpenPopup(renderPopupContent('Предупреждение'))}
                            disabled={isNextDisabled}>
                            Продолжить
                        </ButtonOutlined>
                    </div>
                );
            case 5:
                return (
                    <div className={styles.documentNavigation}>
                        <p>
                            Вы соглашаетесь получать новостные сообщения, их будет мало и редко!
                        </p>
                        <ButtonOutlined outlined sx={{borderColor: "1px solid #d6e0ec"}}
                                        onClick={() => setActivePage(activePage - 1)}>
                            Назад
                        </ButtonOutlined>
                        <ButtonOutlined
                            onClick={() => handleSendData()}
                        >
                            {loading ? 'Обработка...' : 'Перейти к оплате'}
                        </ButtonOutlined>
                    </div>
                );
            default:
                return null;
        }
    };
    const renderTitle = () => {
        switch (activePage) {
            case 1:
                return <>
                    {selectedSamples ?
                        <div>
                            <h2>Выберите <span>образец</span> документа</h2>
                            <p>Обращаем внимание, что в случае выбора образца, Вам необходимо будет загрузить документ,
                                который ему соответствует. В противном случае документ не будет переведен, а денежные
                                средства будут возвращены Вам на счет согласно условий Возврата денежных средств</p>
                        </div>
                        :
                        <h2>Выберите <span>тип</span> документа</h2>}</>;
            case 2:
                return <h2>Выберите <span>язык и подходящий тариф</span></h2>;
            case 3:
                return <h2>Загрузите <span>файл</span></h2>;
            case 4:
                return <div className={styles.infoP}>
                    <h2>Введите <span>данные из документов</span></h2>
                    <p>Мы сможем гарантировать точный и полный перевод, при условии предоставления ФИО латиницей, а также расшифровки печатей и штампов на русском языке</p>
                </div>
            case 5:
                return <h2>Общая стоимость: <span>{totalValue} ₸</span></h2>;
            default:
                return null;
        }
    }

    return (
        <div className={styles.wrapper} id="documents">
            <div className={styles.toggles}>
                <Button
                    onClick={() => setActiveCountry('KZ')}
                    sx={{
                        borderRadius: "10px 0 0 0",
                        backgroundColor: activeCountry === 'KZ' ? '#565add' : '#eff0ff',
                        color: activeCountry === 'KZ' ? '#fff' : '#000',
                        textTransform: "none",
                        gap: "7px",
                        fontSize: "16px",
                        padding: "14px 27px",
                        '&:hover': {
                            backgroundColor: '#565add',
                            color: '#fff',
                        },
                    }}>
                    <Image src={kzFlag} alt="ua" width={16} height={16}/>
                    Казахстан
                </Button>
                <Button
                    onClick={() => setActiveCountry('UA')}
                    sx={{
                        borderRadius: "0 10px 0 0",
                        backgroundColor: activeCountry === 'UA' ? '#565add' : '#eff0ff',
                        color: activeCountry === 'UA' ? '#fff' : '#000',
                        textTransform: "none",
                        gap: "7px",
                        padding: "14px 27px",
                        fontSize: "16px",
                        '&:hover': {
                            backgroundColor: '#565add',
                            color: '#fff',
                        },
                    }}>
                    <Image src={uaFlag} alt="kz" width={16} height={16}/>
                    Украина
                </Button>
            </div>
            <div className={styles.documents}>
                <div className={styles.documentsHeader}>
                    {renderTitle()}
                    <div className={styles.pagination}>
                        {[1, 2, 3, 4, 5].map((number) => (
                            <Button
                                key={number}
                                onClick={() => setActivePage(number)}
                                disabled={activePage !== number}
                                sx={{
                                    minWidth: '40px',
                                    height: '40px',
                                    margin: '0 5px',
                                    backgroundColor: activePage === number ? '#565add' : '#eff0ff',
                                    color: activePage === number ? '#fff' : '#7f7f7f',
                                    border: '1px solid #d6e0ec',
                                    textTransform: 'none',
                                    fontSize: '14px',
                                    width: isMobileView ? '26px' : '57px',
                                    borderRadius: '10px',
                                    '&:hover': {
                                        backgroundColor: activePage === number ? '#565add' : '#eff0ff',
                                        color: activePage === number ? '#fff' : '#7f7f7f',
                                    },
                                }}>
                                {number}
                            </Button>
                        ))}
                    </div>
                </div>
                {renderContent()}
                <div className={styles.documentNavigation}>
                    {renderButtons()}
                </div>
            </div>
        </div>
    );
};

export default TypeOfDocument;